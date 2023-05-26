import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { TeamEntity } from './entities';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TeamListingInput } from './dto/input';

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

  public async validateTeamMemberExist(teamMemberId: number): Promise<boolean> {
    const teamMember = await this.teamRepository.findOne({
      idTeamMember: teamMemberId,
    });
    if (!teamMember) return false;
    return true;
  }

  public async filterTeamMembers(input: TeamListingInput) {
    let filter = {};
    if (input.name) {
      filter = {
        $or: [
          { firstName: { $ilike: input.name } },
          { lastName: { $ilike: input.name } },
          { email: { $ilike: input.name } },
          { contact: { $ilike: input.name } },
        ],
      };
    }
    const [items, count] = await this.teamRepository.findAndCount(filter, {
      limit: input.limit,
      offset: input.offset,
    });

    return {
      hasMore: input.offset < count,
      items,
      total: count,
    };
  }
}
