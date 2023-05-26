import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentInput } from './dto/input/create-assignment.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Allow } from 'src/common/decorators';

@Resolver()
export class AssignmentResolver {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Mutation(() => String)
  @Allow()
  public async createAssignmentLink(
    @Args('input') input: CreateAssignmentInput,
    @CurrentUser() currentUser,
  ): Promise<string> {
    return await this.assignmentService.createAssignment(
      input,
      currentUser.userId,
    );
  }
}
