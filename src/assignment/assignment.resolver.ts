import { Resolver } from '@nestjs/graphql';
import { AssignmentService } from './assignment.service';

@Resolver()
export class AssignmentResolver {
  constructor(private readonly assignmentService: AssignmentService) {}
}
