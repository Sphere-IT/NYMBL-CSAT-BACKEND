import { Field, ObjectType } from "@nestjs/graphql";
import { QuestionTypeEntity } from "./question-type.entity";
import { Column, DataType, Table, Model, HasOne } from "sequelize-typescript";

@ObjectType()
@Table({ tableName: "QUESTION", underscored: true })
export class QuestionEntity extends Model<QuestionEntity> {
  @Column({
    type: DataType.NUMBER,
    autoIncrement: true,
    primaryKey: true,
    field: "ID_QUESTION",
    unique: true,
  })
  @Field(() => Number)
  idQuestion: number;

  @Column({
    type: DataType.NUMBER,
    field: "REF_ID_FORM",
  })
  @Field(() => Number)
  refIdForm: number;

  @Column({
    type: DataType.STRING,
    field: "QUESTION_DETAILS",
  })
  @Field(() => String)
  questionDetails: string;

  @Column({
    type: DataType.NUMBER,
    field: "QUESTION_ORDER",
  })
  @Field(() => Number)
  questionOrder: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
    field: "REF_ID_QUESTION_TYPE",
  })
  @Field(() => Number, { nullable: true })
  refIdQuestionType: number;

  @Column({
    type: DataType.STRING,
    field: "IS_ACTIVE",
  })
  @Field(() => String, { nullable: true, defaultValue: "Y" })
  isActive?: "Y" | "N";

  @Column({
    type: DataType.DATE,
    field: "CREATED_AT",
  })
  @Field(() => Date)
  createdAt?: Date;

  @Column({
    type: DataType.STRING,
    field: "CREATED_BY",
  })
  @Field(() => String)
  createdBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "UPDATED_AT",
  })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "UPDATED_BY",
  })
  @Field(() => String, { nullable: true })
  updatedBy: string;

  @HasOne(() => QuestionTypeEntity, {
    sourceKey: "refIdQuestionType",
    foreignKey: "idQuestionType",
  })
  @Field(() => QuestionTypeEntity, { nullable: true })
  questionType: QuestionTypeEntity;
}
