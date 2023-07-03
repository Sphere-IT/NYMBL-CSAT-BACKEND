import { Field, InputType } from "@nestjs/graphql";
import { USER_TYPES } from "src/team/constants";

@InputType()
class UpdateTeamMemberData {
  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  contact: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => USER_TYPES, { nullable: true })
  userType: USER_TYPES;
}
@InputType()
export class UpdateTeamMemberInput {
  @Field(() => UpdateTeamMemberData)
  data?: UpdateTeamMemberData;

  @Field(() => Number)
  teamMemberId: number;
}
