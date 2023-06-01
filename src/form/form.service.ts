import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FormEntity, QuestionEntity, QuestionTypeEntity } from "./entities";
import {
  CreateFormInput,
  CreateQuestionInput,
  DeleteFormInput,
  DeleteQuestionInput,
  FormListingInput,
  ReorderQuestionInput,
  UpdateFormInput,
  UpdateQuestionInput,
} from "./dto/input";
import { FilterFormResponse } from "./dto/args";
import { SuccessResponse } from "src/common/dto/args";
import validator from "validator";
import { REORDER_DIRECTION } from "./constants";
import { Loaded } from "@mikro-orm/core";
import { InjectModel } from "@nestjs/sequelize";
import { FindAndCountOptions, Op } from "sequelize";

@Injectable()
export class FormService {
  constructor(
    @InjectModel(FormEntity)
    private formRepository: typeof FormEntity,
    @InjectModel(QuestionEntity)
    private questionRepository: typeof QuestionEntity,
  ) {}

  public async getFormDetails(formId: number): Promise<FormEntity> {
    const f = await this.formRepository.findOne(
      {
        raw: true,
        where: {
          idForm: formId,
        },
      },
      // order: { questions: { questionOrder: "ASC" } },
      // {
      //   populate: ["questions"],
      //   populateWhere: {
      //     questions: {
      //       isActive: "Y",
      //     },
      //   },

      // },//TODO: fix me
    );
    if (!f) throw new NotFoundException();
    return f;
  }

  public async getFormQuestions(formId: number): Promise<QuestionEntity[]> {
    const questions = await this.questionRepository.findAll({
      where: {
        refIdForm: formId,
      },
      order: [["questionOrder", "ASC"]],
      raw: true,
    });
    if (!questions?.length) throw new NotFoundException();
    return questions;
  }

  public async getNextUnAnswered(ids: number[]) {
    return this.questionRepository.findOne({
      where: {
        idQuestion: { [Op.notIn]: ids },
        isActive: "Y",
      },
      raw: true,
      order: [["questionOrder", "ASC"]],
    });
  }

  public async getQuestion(questionId: number): Promise<QuestionEntity> {
    const question = await this.questionRepository.findOne(
      {
        raw: true,
        where: {
          idQuestion: questionId,
        },
        include: [QuestionTypeEntity],
      },
      // {
      //   idQuestion: questionId,
      // },
      // { populate: ["questionType"] },//TODO:fix me
    );
    if (!question) throw new NotFoundException();
    return question;
  }

  public async validateFormExist(formId: number): Promise<boolean> {
    const form = await this.formRepository.findOne({
      raw: true,
      where: { idForm: formId },
    });
    if (!form) return false;
    return true;
  }

  public async validateQuestionExist(questionId: number): Promise<boolean> {
    const question = await this.questionRepository.findOne({
      raw: true,
      where: { idQuestion: questionId },
    });
    if (!question) return false;
    return true;
  }

  public async getAllForms() {
    return await this.formRepository.findAll({
      raw: true,
      where: { formIsActive: "Y" },
    });
  }

  public async filterForms(
    input: FormListingInput,
  ): Promise<FilterFormResponse> {
    try {
      const filter: FindAndCountOptions<FormEntity> = {
        where: { formIsActive: "Y" },
      };
      if (input.name) {
        filter.where["formName"] = { [Op.like]: input.name };
        // filter["formName"] = { $ilike: input.name };
      }
      const { rows, count } = await this.formRepository.findAndCountAll({
        ...filter,
        limit: input.limit,
        offset: input.offset,
        raw: true,
        // populate: ["questions"],//TODO: fix me
      });
      return {
        hasMore: input.offset < count,
        items: rows,
        total: count,
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async createForm(
    input: CreateFormInput,
    userId: string,
  ): Promise<SuccessResponse> {
    try {
      if (validator.isEmpty(input.formName)) {
        throw new BadRequestException("Form name not valid");
      }
      await this.formRepository.create({
        formName: input.formName,
        createdAt: new Date(),
        createdBy: userId,
        formIsActive: "Y",
      });
      return {
        success: true,
        message: "Form created successfully",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async updateForm(
    input: UpdateFormInput,
    userId: string,
  ): Promise<SuccessResponse> {
    try {
      if (validator.isEmpty(input.formName)) {
        throw new BadRequestException("Form name not valid");
      }
      const form = await this.formRepository.findOne({
        where: { idForm: input.formId },
      });
      if (!form) throw new NotFoundException("Form does not exist");
      form.formName = input.formName;
      form.updatedAt = new Date();
      form.updatedBy = userId;
      await form.save();
      return {
        success: true,
        message: "Form updated successfully",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async deleteForm(
    input: DeleteFormInput,
    userId,
  ): Promise<SuccessResponse> {
    try {
      const form = await this.formRepository.findOne({
        where: { idForm: input.formId },
      });
      if (!form) throw new NotFoundException("Form does not exist");
      form.formIsActive = "Y";
      form.updatedAt = new Date();
      form.updatedBy = userId;
      await form.save();
      return {
        success: true,
        message: "Form updated successfully",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async createQuestion(
    input: CreateQuestionInput,
    userId: string,
  ): Promise<SuccessResponse> {
    try {
      if (validator.isEmpty(input.questionText)) {
        throw new BadRequestException("Question not valid");
      }
      const validateFormExist = await this.validateFormExist(input.formId);
      if (!validateFormExist) {
        throw new BadRequestException("Form does not exist");
      }
      const questionIndex = await this.questionRepository.count({
        where: { refIdForm: input.formId },
      });
      await this.questionRepository.create({
        questionDetails: input.questionText,
        questionOrder: questionIndex + 1,
        refIdForm: input.formId,
        createdAt: new Date(),
        createdBy: userId,
        refIdQuestionType: 1, //TODO: get question type
        isActive: "Y", //TODO: update entity file
      });
      return {
        success: true,
        message: "Question created successfully",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async updateQuestion(
    input: UpdateQuestionInput,
    userId: string,
  ): Promise<SuccessResponse> {
    try {
      if (validator.isEmpty(input.questionText)) {
        throw new BadRequestException("Question not valid");
      }
      const question = await this.questionRepository.findOne({
        where: { idQuestion: input.questionId },
      });
      if (!question) {
        throw new BadRequestException("Question does not exist");
      }
      question.updatedAt = new Date();
      question.updatedBy = userId;
      question.questionDetails = input.questionText;
      await question.save();
      return {
        success: true,
        message: "Question updated successfully",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async deleteQuestion(
    input: DeleteQuestionInput,
    userId: string,
  ): Promise<SuccessResponse> {
    try {
      const question = await this.questionRepository.findOne({
        where: { idQuestion: input.questionId },
      });
      if (!question) {
        throw new BadRequestException("Question does not exist");
      }
      question.updatedAt = new Date();
      question.updatedBy = userId;
      question.isActive = "N";
      await question.save();
      return {
        success: true,
        message: "Question updated successfully",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async reorderQuestion(
    input: ReorderQuestionInput,
    userId: string,
  ): Promise<SuccessResponse> {
    try {
      const q = await this.questionRepository.findOne({
        where: { idQuestion: input.questionId },
      });
      if (!q) {
        throw new NotFoundException("Question not found");
      }

      let nextQ: Loaded<QuestionEntity> = null;

      if (input.direction === REORDER_DIRECTION.DOWNWARDS) {
        nextQ = await this.questionRepository.findOne({
          where: {
            [Op.and]: {
              refIdForm: q.refIdForm,
              questionOrder: q.questionOrder + 1,
            },
          },
        });
      } else {
        nextQ = await this.questionRepository.findOne({
          where: {
            [Op.and]: {
              refIdForm: q.refIdForm,
              questionOrder: q.questionOrder - 1,
            },
          },
        });
      }

      if (!nextQ) {
        throw new BadRequestException("Cannot perform action");
      }

      const prevIndex = q.questionOrder;
      const nextIndex = nextQ.questionOrder;
      q.questionOrder = nextIndex;
      q.updatedAt = new Date();
      q.updatedBy = userId.toString();
      nextQ.questionOrder = prevIndex;
      nextQ.updatedAt = new Date();
      nextQ.updatedBy = userId.toString();

      await q.save();
      await nextQ.save();

      return {
        success: true,
        message: "Reorder successful",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }

  public async getFormQuestionCount(formId: number): Promise<number> {
    return await this.questionRepository.count({
      where: {
        refIdForm: formId,
        isActive: "Y",
      },
    });
  }
}
