import { AssignmentEntity } from "src/assignment/entities";
import { PaginatedResponse } from "src/common/dto/args";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
class ExportedAssignment {
  @Field(() => Number)
  assignmentId: number;

  @Field(() => String)
  assignmentRef: string;

  @Field(() => String)
  formName: string;

  @Field(() => String)
  status: string;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  averageScore: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  contact: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  customerContact: string;

  @Field(() => String, { nullable: true })
  customerComment?: string;

  @Field(() => String, { nullable: true })
  customerName?: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class AssignmentList extends PaginatedResponse(ExportedAssignment) {}
