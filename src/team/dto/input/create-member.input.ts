import { Field, InputType } from "@nestjs/graphql";
import { USER_TYPES } from "src/team/constants";

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

  @Field(() => USER_TYPES, { defaultValue: USER_TYPES.AGENT })
  userType: USER_TYPES;
}
