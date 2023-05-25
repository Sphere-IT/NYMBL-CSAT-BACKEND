/**
 * CREATE TABLE "submission" (
  "id_submission" SERIAL PRIMARY KEY,
  "ref_id_question" integer,
  "ref_id_assignment" integer,
  "Sub_Value" integer,
  "Sub_Created_Date" timestamp
);
 */

import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ tableName: 'submission' })
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
  @Field(() => Number)
  value: number;
}
