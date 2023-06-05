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
import { ASSIGNMENT_STATUS } from "./constants";
import { v4 as uuidV4 } from "uuid";
import { TeamService } from "src/team/team.service";
import { FormService } from "src/form/form.service";
import { SubmitAnswerInput, SubmitMessageInput } from "./dto/input";
import { QUESTION_TYPE } from "src/form/constants";
import validator from "validator";
import { GetAssignmentResponse } from "./dto/args";
import { InjectModel } from "@nestjs/sequelize";
import { FormEntity } from "src/form/entities";
import { SuccessResponse } from "src/common/dto/args";
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
      createdAt: new Date(),
      assignmentRef: uuidV4(),
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
      const completedStatus = await this.getStatusByCode(
        ASSIGNMENT_STATUS.COMPLETED,
      );
      assignment.refIdStatus = completedStatus.idStatus;
      assignment.finalScore = finalScore?.[0]?.[0]?.["avg"] || 0;
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
    const assignment = await this.assignmentRepository.findOne(
      {
        where: { assignmentRef },
        include: [AssignmentStatusEntity],
      },
      // {
      //   populate: ["status"],//TODO: fixme
      // },
    );
    console.log(assignment.status.statusCode);

    const questions = await this.formService.getFormQuestions(
      assignment.refIdForm,
    );

    const submittedAnswers = await this.submissionRepository.findAll({
      where: { refIdAssignment: assignment.idAssignment },
      attributes: ["refIdQuestion"],
    });
    const ids = submittedAnswers.map((i) => i.refIdQuestion);

    console.log(ids);

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
}
