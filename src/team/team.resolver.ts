import { Args, Query, Resolver } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { Allow } from 'src/common/decorators';
import { FilterTeamResponse } from './dto/args';
import { TeamListingInput } from './dto/input';

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
  async getAllTeamMembers(@Args('input') input: TeamListingInput) {
    return this.teamService.filterTeamMembers(input);
  }
}
