import { Entity, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/entities";
import { FormEntity } from "./form.entity";
import { QuestionTypeEntity } from "./question-type.entity";

@ObjectType()
@Entity({ tableName: "question" })
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
  @Field(() => Number, { nullable: true })
  refIdQuestionType: number;

  @Property()
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isActive?: boolean;

  @ManyToOne(() => FormEntity, {
    nullable: true,
    joinColumn: "ref_id_form",
    referenceColumnName: "id_form",
  })
  @Field(() => FormEntity, { nullable: true })
  form?: FormEntity;

  @OneToOne(() => QuestionTypeEntity, {
    joinColumn: "ref_id_question_type",
    referenceColumnName: "id_question_type",
    nullable: true,
  })
  @Field(() => QuestionTypeEntity, { nullable: true })
  questionType: QuestionTypeEntity;
}
