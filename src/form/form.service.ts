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
  DeleteFormInput,
  FormListingInput,
  UpdateFormInput,
} from "./dto/input";
import { FilterFormResponse } from "./dto/args";
import { SuccessResponse } from "src/common/dto/args";
import validator from "validator";

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
      const filter = {};
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
      if (
        !validator.isAlphanumeric(input.formName) ||
        validator.isEmpty(input.formName)
      ) {
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
      if (
        !validator.isAlphanumeric(input.formName) ||
        validator.isEmpty(input.formName)
      ) {
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
}
