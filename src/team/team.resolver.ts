import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { Allow, CurrentUser } from 'src/common/decorators';
import { FilterTeamResponse, TeamMemberDetailsResponse } from './dto/args';
import {
  CreateTeamMemberInput,
  TeamListingInput,
  UpdateTeamMemberInput,
} from './dto/input';
import { SuccessResponse } from 'src/common/dto/args';

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
  @Allow()
  async createTeamMember(
    @Args('input') input: CreateTeamMemberInput,
    @CurrentUser() currentUser,
  ) {
    return this.teamService.createTeamMember(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async updateTeamMember(
    @Args('input') input: UpdateTeamMemberInput,
    @CurrentUser() currentUser,
  ) {
    return this.teamService.updateTeamMember(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async deleteTeamMember(@Args('teamMemberId') teamMemberId: number) {
    return this.teamService.deleteTeamMember(teamMemberId);
  }

  @Query(() => TeamMemberDetailsResponse)
  @Allow()
  async getTeamMemberDetails(@Args('input') teamMemberId: number) {
    return this.teamService.getTeamMemberDetails(teamMemberId);
  }
}
