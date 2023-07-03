import {
  Args,
  Mutation,
  Query,
  Resolver,
  registerEnumType,
} from "@nestjs/graphql";
import { TeamService } from "./team.service";
import { Allow, CurrentUser } from "src/common/decorators";
import {
  ExposedTeamMember,
  FilterTeamResponse,
  TeamMemberDetailsResponse,
  UserReportResponse,
} from "./dto/args";
import {
  CreateTeamMemberInput,
  TeamListingInput,
  UpdateTeamMemberInput,
} from "./dto/input";
import { SuccessResponse } from "src/common/dto/args";
import { USER_TYPES } from "./constants";
import { TeamEntity } from "./entities";

registerEnumType(USER_TYPES, { name: "USER_TYPES" });

@Resolver()
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => String)
  @Allow()
  async getHello() {
    await this.teamService.getPaginatedTeamMembers();
    return "hello world!";
  }

  @Query(() => FilterTeamResponse)
  @Allow()
  async getAllTeamMembers(@Args("input") input: TeamListingInput) {
    return this.teamService.filterTeamMembers(input);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async createTeamMember(
    @Args("input") input: CreateTeamMemberInput,
    @CurrentUser() currentUser,
  ) {
    return this.teamService.createTeamMember(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async updateTeamMember(
    @Args("input") input: UpdateTeamMemberInput,
    @CurrentUser() currentUser,
  ) {
    return this.teamService.updateTeamMember(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async deleteTeamMember(@Args("teamMemberId") teamMemberId: number) {
    return this.teamService.deleteTeamMember(teamMemberId);
  }

  @Query(() => TeamMemberDetailsResponse)
  @Allow()
  async getTeamMemberDetails(@Args("input") teamMemberId: number) {
    return this.teamService.getTeamMemberDetails(teamMemberId);
  }

  @Query(() => ExposedTeamMember)
  @Allow()
  async getMe(@CurrentUser() currentUser) {
    return this.teamService.getMe(currentUser.userId);
  }

  @Query(() => [UserReportResponse])
  async getTeamReport(@Args("formId") formId: number) {
    return this.teamService.getTeamReport(formId);
  }
}
