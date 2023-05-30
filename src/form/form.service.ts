import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FormEntity, QuestionEntity } from "./entities";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
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

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(FormEntity)
    private formRepository: EntityRepository<FormEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: EntityRepository<QuestionEntity>,
    private em: EntityManager,
  ) {}

  public async getFormDetails(formId: number): Promise<FormEntity> {
    const f = await this.formRepository.findOne(
      { idForm: formId },
      {
        populate: ["questions"],
        orderBy: { questions: { questionOrder: "ASC" } },
      },
    );
    if (!f) throw new NotFoundException();
    return f;
  }

  public async getFormQuestions(formId: number): Promise<QuestionEntity[]> {
    const questions = await this.questionRepository.find(
      { refIdForm: formId },
      { orderBy: { questionOrder: "ASC" } },
    );
    if (!questions?.length) throw new NotFoundException();
    return questions;
  }

  public async getQuestion(questionId: number): Promise<QuestionEntity> {
    const question = await this.questionRepository.findOne({
      idQuestion: questionId,
    });
    if (!question) throw new NotFoundException();
    return question;
  }

  public async validateFormExist(formId: number): Promise<boolean> {
    const form = await this.formRepository.findOne({ idForm: formId });
    if (!form) return false;
    return true;
  }

  public async validateQuestionExist(questionId: number): Promise<boolean> {
    const question = await this.questionRepository.findOne({
      idQuestion: questionId,
    });
    if (!question) return false;
    return true;
  }

  public async getAllForms() {
    return await this.formRepository.find({ formIsActive: true });
  }

  public async filterForms(
    input: FormListingInput,
  ): Promise<FilterFormResponse> {
    try {
      const filter = {
        formIsActive: true,
      };
      if (input.name) {
        filter["formName"] = { $ilike: input.name };
      }
      const [items, count] = await this.formRepository.findAndCount(filter, {
        limit: input.limit,
        offset: input.offset,
      });
      return {
        hasMore: input.offset < count,
        items,
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
      const form = this.formRepository.create({
        formName: input.formName,
        createdAt: new Date(),
        createdBy: userId,
        formIsActive: true,
      });
      await this.em.persistAndFlush(form);
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
      const form = await this.formRepository.findOne({ idForm: input.formId });
      if (!form) throw new NotFoundException("Form does not exist");
      form.formName = input.formName;
      form.updatedAt = new Date();
      form.updatedBy = userId;
      await this.em.persistAndFlush(form);
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
      const form = await this.formRepository.findOne({ idForm: input.formId });
      if (!form) throw new NotFoundException("Form does not exist");
      form.formIsActive = false;
      form.updatedAt = new Date();
      form.updatedBy = userId;
      await this.em.persistAndFlush(form);
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
        refIdForm: input.formId,
      });
      const question = this.questionRepository.create({
        questionDetails: input.questionText,
        questionOrder: questionIndex + 1,
        createdAt: new Date(),
        createdBy: userId,
      });
      await this.em.persistAndFlush(question);
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
      if (
        validator.isEmpty(input.questionText) ||
        !validator.isAlphanumeric(input.questionText)
      ) {
        throw new BadRequestException("Question not valid");
      }
      const question = await this.questionRepository.findOne({
        idQuestion: input.questionId,
      });
      if (!question) {
        throw new BadRequestException("Question does not exist");
      }
      question.updatedAt = new Date();
      question.updatedBy = userId;
      question.questionDetails = input.questionText;
      await this.em.persistAndFlush(question);
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
        idQuestion: input.questionId,
      });
      if (!question) {
        throw new BadRequestException("Question does not exist");
      }
      question.updatedAt = new Date();
      question.updatedBy = userId;
      question.isActive = false;
      await this.em.persistAndFlush(question);
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
        idQuestion: input.questionId,
      });
      if (!q) {
        throw new NotFoundException("Question not found");
      }

      let nextQ: Loaded<QuestionEntity> = null;

      if (input.direction === REORDER_DIRECTION.DOWNWARDS) {
        nextQ = await this.questionRepository.findOne({
          $and: [
            { refIdForm: q.refIdForm },
            { questionOrder: q.questionOrder - 1 },
          ],
        });
      } else {
        nextQ = await this.questionRepository.findOne({
          $and: [
            { refIdForm: q.refIdForm },
            { questionOrder: q.questionOrder + 1 },
          ],
        });
      }

      if (!nextQ) {
        throw new BadRequestException("Cannot perform action");
      }

      const prevIndex = q.questionOrder;
      const nextIndex = nextQ.questionOrder;
      q.questionOrder = nextIndex;
      q.updatedAt = new Date();
      q.updatedBy = userId;
      nextQ.questionOrder = prevIndex;
      nextQ.updatedAt = new Date();
      nextQ.updatedBy = userId;

      await this.em.persistAndFlush(q);
      await this.em.persistAndFlush(nextQ);

      return {
        success: true,
        message: "Reorder successful",
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }
}
