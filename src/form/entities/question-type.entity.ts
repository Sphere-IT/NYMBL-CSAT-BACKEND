import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { QuestionEntity } from "./question.entity";
@ObjectType()
@Table({ tableName: "QUESTION_TYPE", underscored: true, timestamps: false })
export class QuestionTypeEntity extends Model<QuestionTypeEntity> {
  @Column({
    type: DataType.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_QUESTION_TYPE",
    unique: true,
  })
  @Field(() => Number)
  idQuestionType: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    field: "QUESTION_TYPE_CODE",
  })
  @Field(() => String)
  questionTypeCode: string;

  @Column({
    type: DataType.STRING,
    field: "QUESTION_TYPE_NAME",
  })
  @Field(() => String)
  questionTypeName: string;

  @HasMany(() => QuestionEntity, "refIdQuestionType")
  question: QuestionEntity;
}
