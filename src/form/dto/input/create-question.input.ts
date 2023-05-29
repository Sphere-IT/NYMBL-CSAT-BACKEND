import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateQuestionInput {
  @Field(() => Number)
  formId: number;

  @Field(() => String)
  questionText: string;
}
