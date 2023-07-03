import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AssignmentReportResponse {
  @Field(() => String)
  FORM_NAME: string;

  @Field(() => Number)
  AVERAGE_SCORE: number;

  @Field(() => String)
  FIRST_NAME: string;

  @Field(() => String)
  LAST_NAME: string;

  @Field(() => String)
  CONTACT: string;

  @Field(() => String)
  EMAIL: string;

  @Field(() => String, { nullable: true })
  CUSTOMER_CONTACT: string;

  @Field(() => String, { nullable: true })
  CUSTOMER_COMMENT?: string;

  @Field(() => String, { nullable: true })
  CUSTOMER_NAME?: string;

  @Field(() => Date)
  CREATED_AT: Date;
}
