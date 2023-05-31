import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SubmitAnswerInput {
  @Field(() => Number)
  questionId: number;

  @Field(() => String)
  answer: string;

  @Field(() => String)
  assignmentRef: string;
}
