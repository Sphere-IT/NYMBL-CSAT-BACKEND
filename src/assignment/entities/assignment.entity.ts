import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/entities";
import { FormEntity } from "src/form/entities";
import { AssignmentStatusEntity } from "./assignment-status.entity";

/**
 * 
CREATE TABLE "assignments" (
  "id_assignment" SERIAL PRIMARY KEY,
  "ref_id_form" varchar,
  "ref_id_team_member" integer,
  "created_at" timestamp,
  "created_by" varchar,
  "updated_at" timestamp,
  "updated_by" varchar,
  "ref_id_status" integer
);
 */
@ObjectType()
@Entity({ tableName: "assignments" })
export class AssignmentEntity extends BaseEntity {
  @Property({ primary: true, autoincrement: true, nullable: false })
  @Field(() => Number)
  idAssignment: number;

  @Property({ nullable: false })
  @Field(() => Number)
  refIdForm: number;

  @Property({ nullable: false })
  @Field(() => Number)
  refIdTeamMember: number;

  @Property({ nullable: false })
  @Field(() => Number)
  refIdStatus: number;

  @Property({ nullable: true })
  @Field(() => String)
  name: string;

  @Property({ nullable: true })
  @Field(() => String)
  phone: string;

  @Property({ nullable: true })
  @Field(() => String)
  message: string;

  @Property()
  @Field(() => String)
  assignmentRef: string;

  @OneToOne(() => FormEntity, {
    joinColumn: "ref_id_form",
    referenceColumnName: "id_form",
    nullable: true,
  })
  @Field(() => FormEntity, { nullable: true })
  form?: FormEntity;

  @OneToOne(() => AssignmentStatusEntity, {
    joinColumn: "ref_id_status",
    referenceColumnName: "id_status",
    nullable: true,
  })
  @Field(() => AssignmentStatusEntity, { nullable: true })
  status?: AssignmentStatusEntity;
}
