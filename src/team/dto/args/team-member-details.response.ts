import { Field, ObjectType } from '@nestjs/graphql';
import { AssignmentEntity } from 'src/assignment/entities';
import { TeamEntity } from 'src/team/entities';

@ObjectType()
class TeamMemberCommentType {
  @Field(() => String)
  message: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class TeamMemberDetailsResponse {
  @Field(() => TeamEntity)
  details: TeamEntity;

  @Field(() => [TeamMemberCommentType], { nullable: true })
  recentComments: TeamMemberCommentType[];

  @Field(() => [AssignmentEntity], { nullable: true })
  recentSubmissions: any;
}
