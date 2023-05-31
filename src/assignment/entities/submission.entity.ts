/**
 * CREATE TABLE "submission" (
  "id_submission" SERIAL PRIMARY KEY,
  "ref_id_question" integer,
  "ref_id_assignment" integer,
  "Sub_Value" integer,
  "Sub_Created_Date" timestamp
);
 */

import { Entity, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/entities";

@ObjectType()
@Entity({ tableName: "submission" })
export class SubmissionEntity {
  @Property({ primary: true, autoincrement: true })
  @Field(() => Number)
  idSubmission: number;

  @Property()
  @Field(() => Number)
  refIdQuestion: number;

  @Property()
  @Field(() => Number)
  refIdAssignment: number;

  @Property()
  @Field(() => String)
  value: string;

  @Property({ nullable: true })
  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Property({ nullable: true })
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}
