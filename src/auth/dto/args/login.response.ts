import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { TeamEntity } from 'src/team/entities';

@ObjectType()
export class LoginResponse {
  @Field(() => TeamEntity)
  user: TeamEntity;

  @Field(() => String)
  access_token: string;
}
