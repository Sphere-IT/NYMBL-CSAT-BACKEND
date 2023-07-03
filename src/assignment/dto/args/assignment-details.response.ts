import { Field, ObjectType } from "@nestjs/graphql";
import { STATUS_CODES } from "http";
import { ASSIGNMENT_STATUS } from "src/assignment/constants";
import { SubmissionEntity } from "src/assignment/entities";

@ObjectType()
export class AssignmentDetailsResponse {
  @Field(() => String)
  assignmentRef: string;

  @Field(() => ASSIGNMENT_STATUS)
  statusCode: string;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  finalScore?: number;

  @Field(() => String)
  formName: string;

  @Field(() => Date)
  createdDate: Date;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  contact?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [SubmissionEntity])
  submissions: SubmissionEntity[];
}
