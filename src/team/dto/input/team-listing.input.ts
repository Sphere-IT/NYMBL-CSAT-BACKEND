import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TeamListingInput {
  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => String, { nullable: true })
  name?: string;
}
