import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { TeamEntity } from './entities';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { TeamListingInput } from './dto/input';
import { TeamMemberDetailsResponse } from './dto/args';
import { AssignmentService } from 'src/assignment/assignment.service';
import { CreateTeamMemberInput } from './dto/input/create-member.input';
import { SuccessResponse } from 'src/common/dto/args';
import isEmail from 'validator/lib/isEmail';
import { UpdateTeamMemberInput } from './dto/input/update-member.input';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private teamRepository: EntityRepository<TeamEntity>,
    @Inject(forwardRef(() => AssignmentService))
    private assignmentService: AssignmentService,
    private em: EntityManager,
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

  public async createTeamMember(
    input: CreateTeamMemberInput,
    userId: number,
  ): Promise<SuccessResponse> {
    if (
      !input.firstName ||
      !input.lastName ||
      !input.email ||
      !input.password ||
      !input.username ||
      !input.contact
    ) {
      throw new BadRequestException('Invalid input');
    }

    const oldMember = await this.teamRepository.findOne({
      $or: [
        { contact: input.contact },
        { email: input.email },
        { username: input.username },
      ],
    });

    if (oldMember) {
      throw new BadRequestException('User already exists');
    }

    const r = RegExp(/^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/);
    if (!r.test(input.contact)) {
      throw new BadRequestException('Phone number not valid');
    }

    if (!isEmail(input.email)) {
      throw new BadRequestException('Email address not valid');
    }

    const member = this.teamRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      username: input.username,
      contact: input?.contact || null,
      refIdDepartment: input?.refIdDepartment || null,
      createdAt: new Date(),
      createdBy: userId.toString(),
    });

    await this.em.persistAndFlush(member);

    return {
      success: true,
      message: 'Team member created successfully',
    };
  }

  public async updateTeamMember(input: UpdateTeamMemberInput, userId: number) {
    const member = await this.teamRepository.findOne({
      idTeamMember: input.teamMemberId,
    });

    if (!member) {
      throw new BadRequestException('User already exists');
    }

    if (input?.data?.contact) {
      const r = RegExp(
        /^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/,
      );
      if (!r.test(input?.data?.contact)) {
        throw new BadRequestException('Phone number not valid');
      }
    }

    if (input?.data?.email) {
      if (!isEmail(input?.data?.email)) {
        throw new BadRequestException('Email address not valid');
      }
    }

    await this.em.assign(member, {
      ...input.data,
      updatedBy: userId.toString(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: 'Member updated successfully',
    };
  }

  public async deleteTeamMember() {}

  public async getTeamMember() {}
}
