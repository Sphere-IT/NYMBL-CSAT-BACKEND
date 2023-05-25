import { TeamEntity } from 'src/team/entities';
import { BaseEntity } from '../entities';
import {
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
} from 'src/assignment/entities';

export const entities = [
  BaseEntity,
  TeamEntity,
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
];
