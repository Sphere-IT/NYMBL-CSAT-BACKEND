import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities';

@ObjectType()
@Entity({ tableName: 'question' })
export class QuestionEntity extends BaseEntity {
  @Property({ autoincrement: true, primary: true })
  @Field(() => Number)
  idQuestion: number;

  @Property()
  @Field(() => Number)
  refIdForm: number;

  @Property()
  @Field(() => String)
  questionDetails: string;

  @Property()
  @Field(() => Number)
  questionOrder: number;

  @Property()
  @Field(() => Number)
  questionType: number;
}
