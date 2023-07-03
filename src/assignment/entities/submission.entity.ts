/**
 * CREATE TABLE "submission" (
  "id_submission" SERIAL PRIMARY KEY,
  "ref_id_question" integer,
  "ref_id_assignment" integer,
  "Sub_Value" integer,
  "Sub_Created_Date" timestamp
);
 */

import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Table,
  Model,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import { QuestionEntity } from "src/form/entities";

@ObjectType()
@Table({ tableName: "SUBMISSION", underscored: true })
export class SubmissionEntity extends Model<SubmissionEntity> {
  @PrimaryKey
  @Column({
    type: DataType.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_SUBMISSION",
    unique: true,
  })
  @Field(() => Number)
  idSubmission: number;

  @Column({
    type: DataType.NUMBER,
    field: "REF_ID_QUESTION",
  })
  @Field(() => Number)
  refIdQuestion: number;

  @Column({
    type: DataType.NUMBER,
    field: "REF_ID_ASSIGNMENT",
  })
  @Field(() => Number)
  refIdAssignment: number;

  @Column({
    type: DataType.STRING,
    field: "VALUE",
    // allowNull: true,
  })
  @Field(() => String)
  value: string;

  @Column({
    type: DataType.DATE,
    field: "CREATED_AT",
  })
  @Field(() => Date)
  createdAt?: Date;

  @Column({
    type: DataType.STRING,
    field: "CREATE_BY",
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

  @BelongsTo(() => QuestionEntity, {
    foreignKey: "refIdQuestion",
    as: "question",
  })
  @Field(() => QuestionEntity, { nullable: true })
  question?: QuestionEntity;
}
