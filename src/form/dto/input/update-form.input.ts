import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateFormInput {
  @Field(() => Number)
  formId: number;

  @Field(() => String)
  formName: string;
}
