import { Query, Resolver } from '@nestjs/graphql';
import { TeamService } from './team.service';

@Resolver()
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => String)
  async getHello() {
    await this.teamService.getPaginatedTeamMembers();
    return 'hello world!';
  }
}
