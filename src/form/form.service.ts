import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FormEntity, QuestionEntity } from './entities';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(FormEntity)
    private formRepository: EntityRepository<FormEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: EntityRepository<QuestionEntity>,
  ) {}

  public async getFormDetails(formId: number): Promise<FormEntity> {
    const f = await this.formRepository.findOne(
      { idForm: formId },
      {
        populate: ['questions'],
        orderBy: { questions: { questionOrder: 'ASC' } },
      },
    );
    if (!f) throw new NotFoundException();
    return f;
  }

  public async getFormQuestions(formId: number): Promise<QuestionEntity[]> {
    const questions = await this.questionRepository.find(
      { refIdForm: formId },
      { orderBy: { questionOrder: 'ASC' } },
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
}
