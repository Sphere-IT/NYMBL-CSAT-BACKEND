import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FormListingInput {
  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => String, { nullable: true })
  name?: string;
}
