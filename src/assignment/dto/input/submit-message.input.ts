import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SubmitMessageInput {
  @Field(() => String)
  assignmentRef: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String)
  message: string;
}
