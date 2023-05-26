import { Field, InputType } from '@nestjs/graphql';
import { CreateTeamMemberInput } from './create-member.input';

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

  @Field(() => Number, { nullable: true })
  refIdDepartment?: number;
}
@InputType()
export class UpdateTeamMemberInput {
  @Field(() => UpdateTeamMemberData)
  data?: UpdateTeamMemberData;

  @Field(() => Number)
  teamMemberId: number;
}
