// import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { TeamEntity } from "./entities";
import {
  CreateTeamMemberInput,
  TeamListingInput,
  UpdateTeamMemberInput,
} from "./dto/input";
import { TeamMemberDetailsResponse } from "./dto/args";
import { AssignmentService } from "src/assignment/assignment.service";
import { SuccessResponse } from "src/common/dto/args";
import isEmail from "validator/lib/isEmail";
import { InjectModel } from "@nestjs/sequelize";
import { FindAndCountOptions, Op } from "sequelize";

@Injectable()
export class TeamService {
  constructor(
    // @InjectRepository(TeamEntity)
    // private teamRepository: EntityRepository<TeamEntity>,
    @InjectModel(TeamEntity)
    private teamRepository: typeof TeamEntity,
    @Inject(forwardRef(() => AssignmentService))
    private assignmentService: AssignmentService,
  ) {}

  public async getPaginatedTeamMembers() {
    const res = await this.teamRepository.findAll();
    console.log(res);
    return "hello";
  }

  public async findOneByUsername(username: string) {
    const a = await this.teamRepository.findOne({
      where: {
        username,
      },
      raw: true,
    });
    return a;
  }

  public async validateTeamMemberExist(teamMemberId: number): Promise<boolean> {
    const teamMember = await this.teamRepository.findOne({
      where: {
        idTeamMember: teamMemberId,
      },
      raw: true,
    });
    if (!teamMember) return false;
    return true;
  }

  public async filterTeamMembers(input: TeamListingInput) {
    let filter: FindAndCountOptions<TeamEntity> = {
      where: {
        isActive: "Y",
      },
      raw: true,
      offset: input.offset,
      limit: input.limit,
      order: [["firstName", "ASC"]],
    };
    if (input.name) {
      filter = {
        offset: input.offset,
        limit: input.limit,
        order: [["firstName", "ASC"]],
        raw: true,
        where: {
          [Op.and]: {
            isActive: "Y",
            [Op.or]: {
              firstName: { [Op.like]: input.name },
              lastName: { [Op.like]: input.name },
              email: { [Op.like]: input.name },
              contact: { [Op.like]: input.name },
            },
          },
        },
      };
    }
    const aa = await this.teamRepository.findAndCountAll(filter);
    const count = aa.count;
    const items = aa.rows;
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
        where: {
          idTeamMember: teamMemberId,
        },
      });
      const comments: any = await this.assignmentService.getTeamMemberComments(
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
      throw new BadRequestException("Invalid input");
    }

    const oldMember = await this.teamRepository.findOne({
      where: {
        [Op.or]: {
          contact: input.contact,
          email: input.email,
          username: input.username,
        },
      },
    });

    if (oldMember) {
      throw new BadRequestException("User already exists");
    }

    const r = RegExp(/^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/);
    if (!r.test(input.contact)) {
      throw new BadRequestException("Phone number not valid");
    }

    if (!isEmail(input.email)) {
      throw new BadRequestException("Email address not valid");
    }

    await this.teamRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      username: input.username,
      contact: input?.contact || null,
      refIdDepartment: input?.refIdDepartment || null,
      createdAt: new Date(),
      createdBy: userId.toString(),
      isActive: "Y",
    });

    return {
      success: true,
      message: "Team member created successfully",
    };
  }

  public async updateTeamMember(input: UpdateTeamMemberInput, userId: number) {
    const member = await this.teamRepository.findOne({
      where: { idTeamMember: input.teamMemberId },
    });

    if (!member) {
      throw new BadRequestException("User already exists");
    }

    if (input?.data?.contact) {
      const r = RegExp(
        /^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/,
      );
      if (!r.test(input?.data?.contact)) {
        throw new BadRequestException("Phone number not valid");
      }

      const phoneUsed = await this.teamRepository.findOne({
        where: {
          contact: input.data.contact,
          idTeamMember: { $ne: input.teamMemberId },
        },
      });

      if (phoneUsed) {
        throw new BadRequestException("Phone number already exists");
      }
    }

    if (input?.data?.email) {
      if (!isEmail(input?.data?.email)) {
        throw new BadRequestException("Email address not valid");
      }

      const emailUsed = await this.teamRepository.findOne({
        where: {
          contact: input.data.contact,
          idTeamMember: { $ne: input.teamMemberId },
        },
      });

      if (emailUsed) {
        throw new BadRequestException("Email already exists");
      }
    }

    await this.teamRepository.update(
      {
        ...input.data,
        updatedBy: userId.toString(),
        updatedAt: new Date(),
      },
      {
        where: {
          idTeamMember: input.teamMemberId,
        },
      },
    );

    return {
      success: true,
      message: "Member updated successfully",
    };
  }

  public async deleteTeamMember(
    teamMemberId: number,
  ): Promise<SuccessResponse> {
    try {
      await this.teamRepository.update(
        { isActive: "N" },
        { where: { idTeamMember: teamMemberId } },
      );
      return {
        success: true,
        message: "Team member deleted successfully",
      };
    } catch (err) {
      throw err;
    }
  }

  public async getTeamMember(teamMemberId: number): Promise<TeamEntity> {
    try {
      const member = await this.teamRepository.findOne({
        where: { idTeamMember: teamMemberId },
      });
      if (!member) throw new NotFoundException("User not found");
      return member;
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }
}
