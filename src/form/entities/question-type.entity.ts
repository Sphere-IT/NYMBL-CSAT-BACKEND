import { Entity, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity({ tableName: "question_type" })
export class QuestionTypeEntity {
  @Property({ primary: true, autoincrement: true })
  @Field(() => Number)
  idQuestionType: number;

  @Property()
  @Field(() => String)
  questionTypeCode: string;

  @Property()
  @Field(() => String)
  questionTypeName: string;
}
