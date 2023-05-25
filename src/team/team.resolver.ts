import { Query, Resolver } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { Allow } from 'src/common/decorators';

@Resolver()
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => String)
  @Allow()
  async getHello() {
    await this.teamService.getPaginatedTeamMembers();
    return 'hello world!';
  }
}
