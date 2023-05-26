import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
} from './entities';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateAssignmentInput } from './dto/input/create-assignment.input';
import { registerEnumType } from '@nestjs/graphql';
import { ASSIGNMENT_STATUS } from './constants';
import { EntityManager } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';
import { TeamService } from 'src/team/team.service';
import { FormService } from 'src/form/form.service';

registerEnumType(ASSIGNMENT_STATUS, { name: 'ASSIGNMENT_STATUS' });
@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private assignmentRepository: EntityRepository<AssignmentEntity>,
    @InjectRepository(AssignmentStatusEntity)
    private statusRepository: EntityRepository<AssignmentStatusEntity>,
    @InjectRepository(SubmissionEntity)
    private submissionRepository: EntityRepository<SubmissionEntity>,
    private em: EntityManager,
    @Inject(forwardRef(() => TeamService))
    private teamService: TeamService,
    private formService: FormService,
  ) {}

  public async createAssignment(
    input: CreateAssignmentInput,
    userId: string,
  ): Promise<string> {
    const form = await this.formService.validateFormExist(input.formId);
    const team = await this.teamService.validateTeamMemberExist(
      input.teamMemberId,
    );
    if (!form || !team) throw new BadRequestException('Invalid data');

    const pendingStatus = await this.getStatus(ASSIGNMENT_STATUS.PENDING);
    const assignment = this.assignmentRepository.create({
      refIdForm: input.formId,
      refIdTeamMember: input.teamMemberId,
      refIdStatus: pendingStatus.idStatus,
      createdBy: userId,
      createdAt: new Date(),
      assignmentRef: uuidV4(),
    });
    await this.em.persistAndFlush(assignment);
    return assignment.assignmentRef;
  }

  private async getStatus(status: ASSIGNMENT_STATUS) {
    return await this.statusRepository.findOne({ statusCode: status });
  }

  public async getTeamMemberComments(teamMemberId: number) {
    const comments = await this.assignmentRepository.find(
      { refIdTeamMember: teamMemberId },
      { fields: ['message', 'createdAt'], limit: 5 },
    );
    return comments;
  }

  public async getRecentSubmissions(teamMemberId: number) {
    try {
      const submissions = await this.assignmentRepository.find(
        { refIdTeamMember: teamMemberId },
        {
          limit: 5,
          orderBy: { createdAt: 'ASC' },
        },
      );
      return submissions;
    } catch (err) {
      throw new BadRequestException(err?.message, err);
    }
  }
}
