import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
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
  ) {}

  public async createAssignment(
    input: CreateAssignmentInput,
    userId: string,
  ): Promise<string> {
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
}
