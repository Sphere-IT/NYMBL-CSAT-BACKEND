/**
 * CREATE TABLE "assignment_status" (
  "id_status" SERIAL PRIMARY KEY,
  "status_code" varchar,
  "status_name" varchar
);
 */

import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ tableName: 'assignment_status' })
export class AssignmentStatusEntity {
  @Property({ primary: true, autoincrement: true })
  @Field(() => Number)
  idStatus: number;

  @Property()
  @Field(() => String)
  statusCode: string;

  @Property()
  @Field(() => String)
  statusName: string;
}
