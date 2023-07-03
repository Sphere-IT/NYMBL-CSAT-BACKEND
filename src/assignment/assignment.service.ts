import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import {
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
} from "./entities";
import { CreateAssignmentInput } from "./dto/input/create-assignment.input";
import { registerEnumType } from "@nestjs/graphql";
import { ASSIGNMENT_STATUS, SATISFACTION_METRIC } from "./constants";
import { v4 as uuidV4 } from "uuid";
import { TeamService } from "src/team/team.service";
import { FormService } from "src/form/form.service";
import {
  AssignmentReportInput,
  ListAssignmentsInput,
  SubmitAnswerInput,
  SubmitMessageInput,
} from "./dto/input";
import { QUESTION_TYPE } from "src/form/constants";
import validator from "validator";
import {
  AssignmentDetailsResponse,
  AssignmentList,
  GetAssignmentResponse,
  GetFormStatsResponse,
} from "./dto/args";
import { InjectModel } from "@nestjs/sequelize";
import { FormEntity, QuestionEntity } from "src/form/entities";
import { SuccessResponse } from "src/common/dto/args";
import { Op } from "sequelize";
import moment from "moment";
import { assign, round } from "lodash";
import sequelize from "sequelize";
registerEnumType(ASSIGNMENT_STATUS, { name: "ASSIGNMENT_STATUS" });
@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel(AssignmentEntity)
    private assignmentRepository: typeof AssignmentEntity,
    @InjectModel(AssignmentStatusEntity)
    private statusRepository: typeof AssignmentStatusEntity,
    @InjectModel(SubmissionEntity)
    private submissionRepository: typeof SubmissionEntity,
    @Inject(forwardRef(() => TeamService))
    private teamService: TeamService,
    private formService: FormService,
  ) {}

  public async createAssignment(
    input: CreateAssignmentInput,
    userId: string,
  ): Promise<string> {
    const date = new Date();
    const assignmentRef = uuidV4();
    const form = await this.formService.validateFormExist(input.formId);
    const team = await this.teamService.validateTeamMemberExist(
      input.teamMemberId,
    );
    if (!form || !team) throw new BadRequestException("Invalid data");

    const pendingStatus = await this.getStatus(ASSIGNMENT_STATUS.PENDING);
    const assignment = await this.assignmentRepository.create({
      refIdForm: input.formId,
      refIdTeamMember: input.teamMemberId,
      refIdStatus: pendingStatus.idStatus,
      createdBy: userId,
      createdAt: date,
      assignmentRef: assignmentRef,
    });
    return assignment.assignmentRef;
  }

  private async getStatus(status: ASSIGNMENT_STATUS) {
    return await this.statusRepository.findOne({
      where: { statusCode: status },
      raw: true,
    });
  }

  public async getTeamMemberComments(teamMemberId: number) {
    const comments = await this.assignmentRepository.findAll({
      where: {
        refIdTeamMember: teamMemberId,
      },
      attributes: ["message", "createdAt"],
      limit: 5,
      raw: true,
    });
    return comments;
  }

  public async getRecentSubmissions(teamMemberId: number) {
    try {
      const submissions = await this.assignmentRepository.findAll({
        where: { refIdTeamMember: teamMemberId },
        limit: 5,
        order: [["createdAt", "ASC"]],
        // raw: true,
        include: [FormEntity],
      });
      return submissions;
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async submitAnswer(input: SubmitAnswerInput) {
    const assignment = await this.validateAssignmentExists(input.assignmentRef);
    const questionExist = this.formService.validateQuestionExist(
      input.questionId,
    );
    if (!questionExist) throw new NotFoundException("Question does not exist");

    const question = await this.formService.getQuestion(input.questionId);

    this.validateAnswerType(
      question.questionType.questionTypeCode,
      input.answer,
    );

    await this.validateNotAnswered(assignment.idAssignment, input.questionId);

    const submission = await this.submissionRepository.create({
      value: input.answer,
      refIdQuestion: question.idQuestion,
      refIdAssignment: assignment.idAssignment,
      createdAt: new Date(),
    });

    //handle if this is the final question
    const inProgressStatus = await this.getStatusByCode(
      ASSIGNMENT_STATUS.IN_PROGRESS,
    );

    assignment.refIdStatus = inProgressStatus.idStatus;
    await submission.save();
    await assignment.save();

    await this.checkAssignmentCompletion(assignment);

    //TODO: return updated data
    return {
      success: true,
      message: "Answer submitted successfully",
    };
  }

  private async checkAssignmentCompletion(assignment: AssignmentEntity) {
    const totalQuestions = await this.formService.getFormQuestionCount(
      assignment.refIdForm,
    );
    const submissionTotal = await this.submissionRepository.count({
      where: { refIdAssignment: assignment.idAssignment },
    });

    if (totalQuestions === submissionTotal) {
      //get score
      const finalScoreQuery = `select s.ref_id_assignment, ROUND(AVG(s.value), 2) as avg from submission s
      left join question q on q.id_question = s.ref_id_question
      left join question_type qt on qt.id_question_type = q.ref_id_question_type
      where s.ref_id_assignment = ${assignment.idAssignment} and qt.question_type_code = '${QUESTION_TYPE.NUMERIC}'
      group by s.ref_id_assignment;`;

      const finalScore = await this.submissionRepository.sequelize.query(
        finalScoreQuery,
      );
      const completedStatus = await this.getStatusByCode(
        ASSIGNMENT_STATUS.COMPLETED,
      );
      assignment.refIdStatus = completedStatus.idStatus;
      assignment.finalScore = finalScore?.[0]?.[0]?.["AVG"] || 0;
      await assignment.save();
    }
  }

  public async testMe() {
    const finalScoreQuery = `select s.ref_id_assignment, ROUND(AVG(s.value), 2)::INTEGER as avg from submission s
      left join question q on q.id_question = s.ref_id_question
      left join question_type qt on qt.id_question_type = q.ref_id_question_type
      where s.ref_id_assignment = 48 and qt.question_type_code = '${QUESTION_TYPE.NUMERIC}'
      group by s.ref_id_assignment;`;

    const finalScore = await this.submissionRepository.sequelize.query(
      finalScoreQuery,
    );
    console.log(
      finalScore?.[0]?.[0]?.["avg"],
      typeof finalScore?.[0]?.[0]?.["avg"],
    );
  }

  private async validateAssignmentExists(
    assignmentRef: string,
  ): Promise<AssignmentEntity> {
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentRef },
    });
    if (!assignment) throw new NotFoundException("Assignment does not exist");
    return assignment;
  }

  private validateAnswerType(code: string, answerValue: string) {
    if (code === QUESTION_TYPE.NUMERIC && !validator.isNumeric(answerValue)) {
      throw new BadRequestException("Answer not valid");
    }
  }

  private async getAssignmentStatuses() {
    return await this.statusRepository.findAll({});
  }

  private async getStatusByCode(statusCode: ASSIGNMENT_STATUS) {
    return await this.statusRepository.findOne({
      raw: true,
      where: { statusCode },
    });
  }

  private async validateNotAnswered(assignmentId, questionId) {
    const submission = await this.submissionRepository.findOne({
      where: {
        refIdAssignment: assignmentId,
        refIdQuestion: questionId,
      },
      raw: true,
    });
    if (submission?.idSubmission) {
      throw new BadRequestException("Question already answered");
    }
  }

  public async getAssignment(
    assignmentRef: string,
  ): Promise<GetAssignmentResponse> {
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentRef },
      include: [AssignmentStatusEntity],
    });
    console.log(assignment.status.statusCode);

    const questions = await this.formService.getFormQuestions(
      assignment.refIdForm,
    );

    const submittedAnswers = await this.submissionRepository.findAll({
      where: { refIdAssignment: assignment.idAssignment },
      attributes: ["refIdQuestion"],
    });
    const ids = submittedAnswers.map((i) => i.refIdQuestion);

    const currentQuestion = await this.formService.getNextUnAnswered(
      ids,
      assignment.refIdForm,
    );

    return {
      assignmentRef,
      questions,
      currentQuestion: currentQuestion,
      status: assignment.status,
    };
  }

  public async getAssignmentDetails(
    assignmentRef: string,
  ): Promise<AssignmentDetailsResponse> {
    const assignment = await this.assignmentRepository.findOne({
      where: {
        assignmentRef,
      },
      include: [AssignmentStatusEntity],
      // raw: true,
    });
    const submissions = await this.submissionRepository.findAll({
      where: {
        refIdAssignment: assignment.idAssignment,
      },
      include: [
        {
          model: QuestionEntity,
          as: "question",
          isAliased: true,
          // separate: true,
          where: {
            isActive: "Y",
          },
        },
      ],
      order: [[QuestionEntity.sequelize.col("QUESTION_ORDER"), "ASC"]],
      // raw: true,
    });

    return {
      formName: "",
      finalScore: assignment?.finalScore || 0,
      contact: assignment.phone,
      message: assignment.message,
      name: assignment.name,
      statusCode: assignment.status.statusCode,
      submissions: submissions,
      assignmentRef,
      createdDate: assignment.createdAt,
    };
  }

  public async submitMessage(
    input: SubmitMessageInput,
  ): Promise<SuccessResponse> {
    try {
      const assignment = await this.assignmentRepository.findOne({
        where: {
          assignmentRef: input.assignmentRef,
        },
      });

      if (!assignment) {
        throw new NotFoundException("Assignment does not exist");
      }

      assignment.name = input.name;
      assignment.message = input.message;
      assignment.phone = input?.phone || null;

      await assignment.save();

      return {
        success: true,
        message: "Message submitted successfully",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async listAssignments(
    input: ListAssignmentsInput,
  ): Promise<AssignmentList> {
    let statusFilter = "";
    if (input.status) {
      statusFilter = `WHERE as2.STATUS_CODE = '${input.status}'`;
    }
    const query = `
      select
      a.ID_ASSIGNMENT AS "assignmentId",
      a.ASSIGNMENT_REF AS "assignmentRef",
      f.FORM_NAME AS "formName",
      (SELECT avg(sub.VALUE) FROM SUBMISSION sub WHERE sub.REF_ID_ASSIGNMENT = a.ID_ASSIGNMENT) AS "averageScore",
      tm.FIRST_NAME AS "firstName",
      tm.LAST_NAME AS "lastName",
      tm.CONTACT AS "contact",
      tm.EMAIL AS "email",
      a.PHONE AS "customerContact",
      as2.STATUS_NAME as "status",
      a.MESSAGE AS "customerComment",
      a.NAME AS "customerName",
      a.CREATED_AT as "createdAt"
      FROM ASSIGNMENTS a
      LEFT JOIN FORM f ON f.ID_FORM = a.REF_ID_FORM 
      LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS 
      LEFT JOIN TEAM_MEMBER tm ON tm.ID_TEAM_MEMBER = a.REF_ID_TEAM_MEMBER
      ${statusFilter}
      OFFSET ${input.offset} ROWS
      FETCH NEXT ${input.limit} ROWS ONLY
    `;

    const countRes = await this.assignmentRepository.sequelize.query(`
    select count(*) as "count"
    FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS 
    ${statusFilter}`);
    const res = await this.assignmentRepository.sequelize.query(query, {
      raw: true,
    });
    console.log(countRes);
    return {
      total: countRes?.[0]?.[0]?.["count"] || 0,
      hasMore:
        (countRes?.[0]?.[0]?.["count"] || 0) > input.limit + input.offset,
      items: res[0],
    };
  }

  public async deleteAssignment(assignmentId): Promise<SuccessResponse> {
    const assignment = await this.assignmentRepository.findOne({
      where: {
        idAssignment: assignmentId,
      },
      include: [AssignmentStatusEntity],
    });

    if (!assignment) {
      throw new NotFoundException("Assignment does not exist");
    }

    if (assignment.status.statusCode === ASSIGNMENT_STATUS.COMPLETED) {
      throw new BadRequestException("Completed assignments can't be deleted");
    }

    await this.assignmentRepository.destroy({
      where: {
        idAssignment: assignmentId,
      },
    });

    return {
      success: true,
      message: "Deleted successfully",
    };
  }

  public async getAssignmentReport(input: AssignmentReportInput) {
    let dateFilter = "";
    let scoreFilter = "";
    let teamMemberFilter = "";
    if (input.betweenDates) {
      dateFilter = `AND a.CREATED_AT  BETWEEN '${moment(
        input.betweenDates[0],
      ).format("DD-MMM-YYYY")}' AND '${moment(input.betweenDates[1]).format(
        "DD-MMM-YYYY",
      )}'`;
    }

    if (input.betweenScore) {
      scoreFilter = `WHERE AVERAGE_SCORE BETWEEN ${input.betweenScore[0]} AND ${input.betweenScore[1]}`;
    }

    if (input.teamMemberId) {
      teamMemberFilter = `AND a.REF_ID_TEAM_MEMBER = ${input.teamMemberId}`;
    }
    const query = `
    SELECT * FROM (SELECT
      f.FORM_NAME AS FORM_NAME,
      (SELECT avg(sub.VALUE) FROM SUBMISSION sub WHERE sub.REF_ID_ASSIGNMENT = a.ID_ASSIGNMENT) AS AVERAGE_SCORE,
      tm.FIRST_NAME,
      tm.LAST_NAME,
      tm.CONTACT,
      tm.EMAIL,
      a.PHONE AS "CUSTOMER_CONTACT",
      a.MESSAGE AS "CUSTOMER_COMMENT",
      a.NAME AS "CUSTOMER_NAME",
      a.CREATED_AT
      FROM ASSIGNMENTS a
      LEFT JOIN FORM f ON f.ID_FORM = a.REF_ID_FORM 
      LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS 
      LEFT JOIN TEAM_MEMBER tm ON tm.ID_TEAM_MEMBER = a.REF_ID_TEAM_MEMBER
      WHERE a.REF_ID_FORM = ${input.formId}
      AND as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}'
      ${dateFilter}
      ${teamMemberFilter})
      ${scoreFilter};
    `;
    const res = await this.assignmentRepository.sequelize.query(query, {
      raw: true,
    });
    return res[0];
  }

  /*================================================STATISTICS====================================================*/
  public async surveyResponseRate(formId: number) {
    const today = new Date();
    const currentMonthStart = moment(today).startOf("month").startOf("day");
    const currentMonthEnd = moment(today).endOf("month").endOf("day");
    const previousMonthStart = moment(today)
      .subtract(1, "month")
      .startOf("month")
      .startOf("day");
    const previousMonthEnd = moment(today)
      .subtract(1, "month")
      .endOf("month")
      .endOf("day");
    const totalSurveys = await this.assignmentRepository.count({
      where: {
        refIdForm: formId,
        createdAt: {
          [Op.gte]: currentMonthStart.format("DD-MMM-YYYY"),
        },
      },
    });
    const pastMonth = await this.assignmentRepository.count({
      where: {
        createdAt: {
          [Op.between]: [
            previousMonthStart.toDate(),
            previousMonthEnd.toDate(),
          ],
        },
        refIdForm: formId,
      },
    });
    const currentMonth = await this.assignmentRepository.count({
      where: {
        createdAt: {
          [Op.between]: [currentMonthStart.toDate(), currentMonthEnd.toDate()],
        },
        refIdForm: formId,
      },
    });
    const statusTotals: any = await this.assignmentRepository.sequelize
      .query(`SELECT COUNT(*) AS "value", as2.STATUS_NAME AS "name" FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE a.CREATED_AT >= '${currentMonthStart.format(
      "DD-MMM-YYYY",
    )}' AND a.REF_ID_FORM = ${formId}
    GROUP BY as2.STATUS_NAME;`);
    const differencePercentage = round(
      (currentMonth / pastMonth) * 100 - 100,
      2,
    );
    return {
      statusTotals: statusTotals[0],
      totalSurveys,
      differencePercentage:
        differencePercentage === Infinity ? 100 : differencePercentage,
    };
  }

  public async overAllSatisfaction(formId: number) {
    const date = new Date();
    const startDate = moment(date)
      .startOf("year")
      .startOf("month")
      .startOf("day");
    const res: any = await this.assignmentRepository.sequelize
      .query(`SELECT count(*) AS "value" , "name" FROM (
      SELECT ROUND(FINAL_SCORE) AS "averageScore", 
      CASE ROUND(FINAL_SCORE)
        WHEN 1 THEN '${SATISFACTION_METRIC.VERY_DISSATISFIED}'
        WHEN 2 THEN '${SATISFACTION_METRIC.DISSATISFIED}'
        WHEN 3 THEN '${SATISFACTION_METRIC.NEUTRAL}'
        WHEN 4 THEN '${SATISFACTION_METRIC.SATISFIED}'
        WHEN 5 THEN '${SATISFACTION_METRIC.VERY_SATISFIED}'
      END AS "name"
      FROM ASSIGNMENTS a
      LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
      WHERE as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}'
      AND a.REF_ID_FORM = ${formId}
      AND a.CREATED_AT >= '${startDate.format("DD-MMM-YYYY")}')
      GROUP BY "name";`);
    console.log(res[0]);
    return res[0];
  }

  public async getAverageQuestionSelection(formId: number) {
    const res = await this.assignmentRepository.sequelize.query(`
    SELECT "label", "data" FROM (SELECT 
      CONCAT('Q',q.QUESTION_ORDER) AS "label",
      (
      SELECT json_arrayagg(json_object(
        'total' VALUE TO_CHAR("total"),
        'label' VALUE "label"
      )) FROM (
      SELECT count(*) AS "total", "label" FROM (
      SELECT 
        CASE to_number(s2.VALUE)
              WHEN 1 THEN '${SATISFACTION_METRIC.VERY_DISSATISFIED}'
              WHEN 2 THEN '${SATISFACTION_METRIC.DISSATISFIED}'
              WHEN 3 THEN '${SATISFACTION_METRIC.NEUTRAL}'
              WHEN 4 THEN '${SATISFACTION_METRIC.SATISFIED}'
              WHEN 5 THEN '${SATISFACTION_METRIC.VERY_SATISFIED}'
            END AS "label"
      FROM SUBMISSION s2
      WHERE s2.REF_ID_QUESTION = s.REF_ID_QUESTION
      )
      GROUP BY "label"
      )
      )
      AS "data"
      FROM SUBMISSION s
      LEFT JOIN QUESTION q ON q.ID_QUESTION = s.REF_ID_QUESTION
      WHERE q.REF_ID_FORM = ${formId}
      ORDER BY "label")
      GROUP BY "label", "data";
    `);
    console.log(res[0]);
    return {
      dataSets: res[0],
      labels: [
        SATISFACTION_METRIC.VERY_DISSATISFIED,
        SATISFACTION_METRIC.DISSATISFIED,
        SATISFACTION_METRIC.NEUTRAL,
        SATISFACTION_METRIC.SATISFIED,
        SATISFACTION_METRIC.VERY_SATISFIED,
      ],
    };
  }

  private async getTopPerformingAgents(formId: number) {
    const startDate = moment()
      .startOf("year")
      .startOf("month")
      .startOf("day")
      .format("DD-MMM-YYYY");
    const endDate = moment()
      .endOf("year")
      .endOf("month")
      .endOf("day")
      .format("DD-MMM-YYYY");
    const res = await this.assignmentRepository.sequelize
      .query(`SELECT tm.ID_TEAM_MEMBER AS "teamMemberId", (tm.FIRST_NAME || ' ' || tm.LAST_NAME) AS "name" , AVG(a.FINAL_SCORE) AS "averageScore"  FROM ASSIGNMENTS a
    LEFT JOIN TEAM_MEMBER tm ON tm.ID_TEAM_MEMBER = a.REF_ID_TEAM_MEMBER
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}' 
    AND a.REF_ID_FORM = ${formId}
    AND a.CREATED_AT BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY tm.ID_TEAM_MEMBER, (tm.FIRST_NAME || ' ' || tm.LAST_NAME)
    ORDER BY "averageScore" DESC
    FETCH FIRST 5 ROWS ONLY;`);
    return res[0];
  }

  private async getAverageQuarterlyScore(formId: number) {
    const quarter1 = {
      start: moment().month(0).startOf("month").format("DD-MMM-YYYY"),
      end: moment().month(2).endOf("month").format("DD-MMM-YYYY"),
    };
    const quarter2 = {
      start: moment().month(3).startOf("month").format("DD-MMM-YYYY"),
      end: moment().month(5).endOf("month").format("DD-MMM-YYYY"),
    };
    const quarter3 = {
      start: moment().month(6).startOf("month").format("DD-MMM-YYYY"),
      end: moment().month(8).endOf("month").format("DD-MMM-YYYY"),
    };
    const quarter4 = {
      start: moment().month(9).startOf("month").format("DD-MMM-YYYY"),
      end: moment().month(11).endOf("month").format("DD-MMM-YYYY"),
    };
    const res = await this.assignmentRepository.sequelize.query(`SELECT 
    'Q1' AS "label",
    COALESCE(AVG(a.FINAL_SCORE), 0) AS "averageScore"
    FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE a.CREATED_AT
    BETWEEN '${quarter1.start}' AND '${quarter1.end}'
    AND as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}'
    AND a.REF_ID_FORM = ${formId}
    UNION ALL 
    SELECT 
    'Q2' AS "label",
    COALESCE(AVG(a.FINAL_SCORE), 0) AS "averageScore"
    FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE a.CREATED_AT
    BETWEEN '${quarter2.start}' AND '${quarter2.end}'
    AND as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}'
    AND a.REF_ID_FORM = ${formId}
    UNION ALL 
    SELECT 
    'Q3' AS "label",
    COALESCE(AVG(a.FINAL_SCORE), 0) AS "averageScore"
    FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE a.CREATED_AT
    BETWEEN '${quarter3.start}' AND '${quarter3.end}'
    AND as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}'
    AND a.REF_ID_FORM = ${formId}
    UNION ALL 
    SELECT 
    'Q4' AS "label",
    COALESCE(AVG(a.FINAL_SCORE), 0) AS "averageScore"
    FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE a.CREATED_AT
    BETWEEN '${quarter4.start}' AND '${quarter4.end}'
    AND a.REF_ID_FORM = ${formId}
    AND as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}';`);
    return res[0];
  }

  private async getNPS(formId: number) {
    const detractors = await this.assignmentRepository.sequelize
      .query(`SELECT count(FINAL_SCORE) as "total"
    FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}'
    AND FINAL_SCORE < 3
    AND REF_ID_FORM = ${formId};
    `);
    const promoters = await this.assignmentRepository.sequelize
      .query(`SELECT count(FINAL_SCORE) AS "total"
    FROM ASSIGNMENTS a
    LEFT JOIN ASSIGNMENT_STATUS as2 ON as2.ID_STATUS = a.REF_ID_STATUS
    WHERE as2.STATUS_CODE = '${ASSIGNMENT_STATUS.COMPLETED}'
    AND FINAL_SCORE > 4
    AND REF_ID_FORM = ${formId};
    `);
    const total =
      (await this.assignmentRepository.count({
        include: [
          {
            model: AssignmentStatusEntity,
            required: true,
            where: {
              statusCode: ASSIGNMENT_STATUS.COMPLETED,
            },
          },
        ],
      })) ?? 0;
    const promoterPercentage =
      round((promoters[0][0]["total"] / total) * 100) ?? 0;
    const detractorPercentage =
      round((detractors[0][0]["total"] / total) * 100) ?? 0;

    return promoterPercentage - detractorPercentage || 0;
  }

  public async getFormStats(formId): Promise<GetFormStatsResponse> {
    const surveyResponse = await this.surveyResponseRate(formId);
    const overallSatisfaction = await this.overAllSatisfaction(formId);
    const questionTotalSelection: any = await this.getAverageQuestionSelection(
      formId,
    );
    const topPerformingAgents: any = await this.getTopPerformingAgents(formId);
    const averageQuarterlyScore: any = await this.getAverageQuarterlyScore(
      formId,
    );
    const nps: any = await this.getNPS(formId);
    return {
      surveyResponse,
      overallSatisfaction,
      questionTotalSelection,
      topPerformingAgents,
      averageQuarterlyScore,
      nps,
    };
  }
}
