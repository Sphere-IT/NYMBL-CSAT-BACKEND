import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AssignmentService } from "./assignment.service";
import { CreateAssignmentInput } from "./dto/input/create-assignment.input";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Allow } from "src/common/decorators";
import { SuccessResponse } from "src/common/dto/args";
import { SubmitAnswerInput } from "./dto/input";
import { GetAssignmentResponse } from "./dto/args";

@Resolver()
export class AssignmentResolver {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Mutation(() => String)
  @Allow()
  public async createAssignmentLink(
    @Args("input") input: CreateAssignmentInput,
    @CurrentUser() currentUser,
  ): Promise<string> {
    return await this.assignmentService.createAssignment(
      input,
      currentUser.userId,
    );
  }

  @Mutation(() => SuccessResponse)
  public async submitAnswer(@Args("input") input: SubmitAnswerInput) {
    return this.assignmentService.submitAnswer(input);
  }

  @Query(() => GetAssignmentResponse)
  public async getAssignment(@Args("assignmentRef") assignmentRef: string) {
    return this.assignmentService.getAssignment(assignmentRef);
  }
}
