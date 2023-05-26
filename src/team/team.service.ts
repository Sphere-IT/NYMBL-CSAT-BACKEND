import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { TeamEntity } from './entities';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TeamListingInput } from './dto/input';
import { TeamMemberDetailsResponse } from './dto/args';
import { AssignmentService } from 'src/assignment/assignment.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private teamRepository: EntityRepository<TeamEntity>,
    @Inject(forwardRef(() => AssignmentService))
    private assignmentService: AssignmentService,
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

  public async getTeamMemberDetails(
    teamMemberId: number,
  ): Promise<TeamMemberDetailsResponse> {
    try {
      const member = await this.teamRepository.findOne({
        idTeamMember: teamMemberId,
      });
      const comments = await this.assignmentService.getTeamMemberComments(
        teamMemberId,
      );
      const submissions = await this.assignmentService.getRecentSubmissions(
        teamMemberId,
      );
      return {
        details: member,
        recentComments: comments,
        recentSubmissions: submissions,
      };
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }
}
