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
import { Column, DataType, Table, Model } from "sequelize-typescript";

@ObjectType()
@Table({ tableName: "submission", underscored: true })
export class SubmissionEntity extends Model<SubmissionEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  @Field(() => Number)
  idSubmission: number;

  @Column({
    type: DataType.INTEGER,
  })
  @Field(() => Number)
  refIdQuestion: number;

  @Column({
    type: DataType.INTEGER,
  })
  @Field(() => Number)
  refIdAssignment: number;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  value: string;

  @Column(DataType.DATE)
  @Field(() => Date)
  createdAt?: Date;

  @Column(DataType.STRING)
  @Field(() => String)
  createdBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @Field(() => String, { nullable: true })
  updatedBy: string;
}
