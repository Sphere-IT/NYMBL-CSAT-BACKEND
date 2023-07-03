import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AssignmentService } from "./assignment.service";
import { CreateAssignmentInput } from "./dto/input/create-assignment.input";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Allow } from "src/common/decorators";
import { SuccessResponse } from "src/common/dto/args";
import {
  AssignmentReportInput,
  ListAssignmentsInput,
  SubmitAnswerInput,
  SubmitMessageInput,
} from "./dto/input";
import {
  AssignmentDetailsResponse,
  AssignmentList,
  AssignmentReportResponse,
  GetAssignmentResponse,
  GetFormStatsResponse,
} from "./dto/args";
import { AssignmentEntity } from "./entities";

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

  @Mutation(() => SuccessResponse)
  public async submitMessage(
    @Args("input") input: SubmitMessageInput,
  ): Promise<SuccessResponse> {
    return this.assignmentService.submitMessage(input);
  }

  @Query(() => GetFormStatsResponse)
  @Allow()
  public async getFormStats(@Args("formId") formId: number) {
    return this.assignmentService.getFormStats(formId);
  }

  @Query(() => AssignmentDetailsResponse)
  @Allow()
  public async getAssignmentDetails(
    @Args("assignmentId") assignmentId: string,
  ) {
    return this.assignmentService.getAssignmentDetails(assignmentId);
  }

  @Query(() => AssignmentList)
  @Allow()
  public async listAllAssignments(@Args("input") input: ListAssignmentsInput) {
    return this.assignmentService.listAssignments(input);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  public async deleteAssignment(@Args("assignmentId") assignmentId: number) {
    return this.assignmentService.deleteAssignment(assignmentId);
  }

  @Query(() => [AssignmentReportResponse])
  public async getAssignmentReport(
    @Args("input") input: AssignmentReportInput,
  ) {
    return this.assignmentService.getAssignmentReport(input);
  }
}
