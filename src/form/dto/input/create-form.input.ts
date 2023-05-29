import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateFormInput {
  @Field(() => String)
  formName: string;
}
