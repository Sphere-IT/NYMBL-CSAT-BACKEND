import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteFormInput {
  @Field(() => Number)
  formId: number;
}
