import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamMemberInput } from './create-member.input';

@InputType()
export class UpdateTeamMemberInput {
  @Field(() => PartialType(CreateTeamMemberInput))
  data?: Partial<CreateTeamMemberInput>;

  @Field(() => Number)
  teamMemberId: number;
}
