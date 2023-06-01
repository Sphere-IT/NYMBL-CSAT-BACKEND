import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
} from "sequelize-typescript";
import { QuestionEntity } from "./question.entity";
@ObjectType()
@Table({ tableName: "question_type", underscored: true })
export class QuestionTypeEntity extends Model<QuestionTypeEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  @Field(() => Number)
  idQuestionType: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  @Field(() => String)
  questionTypeCode: string;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  questionTypeName: string;

  @BelongsTo(() => QuestionEntity, "refIdQuestionType")
  question: QuestionEntity;
}
