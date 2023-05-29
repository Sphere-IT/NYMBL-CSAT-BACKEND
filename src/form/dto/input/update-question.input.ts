import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateQuestionInput {
  @Field(() => Number)
  questionId: number;

  @Field(() => String)
  questionText: string;
}
