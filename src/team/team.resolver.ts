import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { Allow } from 'src/common/decorators';
import { FilterTeamResponse } from './dto/args';
import { TeamListingInput } from './dto/input';
import { SuccessResponse } from 'src/common/dto/args';
import { CreateTeamMemberInput } from './dto/input/create-member.input';

@Resolver()
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => String)
  @Allow()
  async getHello() {
    await this.teamService.getPaginatedTeamMembers();
    return 'hello world!';
  }

  @Query(() => FilterTeamResponse)
  @Allow()
  async getAllTeamMembers(@Args('input') input: TeamListingInput) {
    return this.teamService.filterTeamMembers(input);
  }

  @Mutation(() => SuccessResponse)
  // @Allow()
  async createTeamMember(@Args('input') input: CreateTeamMemberInput) {
    return this.teamService.createTeamMember(input);
  }
}
