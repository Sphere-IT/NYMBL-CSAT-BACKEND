import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FormEntity, QuestionEntity } from './entities';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(FormEntity)
    private formRepository: EntityRepository<FormEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: EntityRepository<QuestionEntity>
  ) {}

  public async getFormDetails() {}

  public async getFormQuestions() {}

  public async validateFormExist() {}

  public async validateQuestionExist() {}

}
