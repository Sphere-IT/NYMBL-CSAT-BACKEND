import { TeamEntity } from "src/team/entities";
import { BaseEntity } from "../entities";
import {
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
} from "src/assignment/entities";
import {
  FormEntity,
  QuestionEntity,
  QuestionTypeEntity,
} from "src/form/entities";

export const entities = [
  BaseEntity,
  // TeamEntity,
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
  FormEntity,
  QuestionEntity,
  QuestionTypeEntity,
];
