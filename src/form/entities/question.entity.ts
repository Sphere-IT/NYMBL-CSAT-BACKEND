import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/entities";
import { FormEntity } from "./form.entity";

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
  @Field(() => Number)
  questionType: number;

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
}
