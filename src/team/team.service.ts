import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { TeamEntity } from './entities';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private teamRepository: EntityRepository<TeamEntity>,
  ) {}

  public async getPaginatedTeamMembers() {
    const res = await this.teamRepository.findAll();
    console.log(res);
    return 'hello';
  }

  public async findOneByUsername(username: string) {
    return await this.teamRepository.findOne({ username });
  }
}
