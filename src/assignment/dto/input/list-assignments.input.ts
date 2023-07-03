import { Field, InputType } from "@nestjs/graphql";
import { ASSIGNMENT_STATUS } from "src/assignment/constants";

@InputType()
export class ListAssignmentsInput {
  @Field(() => Number, { nullable: true })
  limit: number;

  @Field(() => Number, { nullable: true })
  offset: number;

  @Field(() => ASSIGNMENT_STATUS, { nullable: true })
  status?: ASSIGNMENT_STATUS;
}
