import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteQuestionInput {
  @Field(() => Number)
  questionId: number;
}
