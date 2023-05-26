import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTeamMemberInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  contact: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;

  @Field(() => Number, { nullable: true })
  refIdDepartment?: number;
}
