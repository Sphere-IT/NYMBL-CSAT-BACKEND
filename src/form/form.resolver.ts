import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FormService } from "./form.service";
import { FormEntity } from "./entities";
import { Allow, CurrentUser } from "src/common/decorators";
import { FilterFormResponse } from "./dto/args";
import {
  CreateFormInput,
  CreateQuestionInput,
  DeleteFormInput,
  FormListingInput,
  UpdateFormInput,
  UpdateQuestionInput,
} from "./dto/input";
import { SuccessResponse } from "src/common/dto/args";

@Resolver()
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Query(() => [FormEntity])
  @Allow()
  async listAllForms() {
    return await this.formService.getAllForms();
  }

  @Query(() => FilterFormResponse)
  @Allow()
  async getAllForms(@Args("input") input: FormListingInput) {
    return await this.formService.filterForms(input);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async createForm(
    @Args("input") input: CreateFormInput,
    @CurrentUser() currentUser,
  ) {
    return await this.formService.createForm(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async updateForm(
    @Args("input") input: UpdateFormInput,
    @CurrentUser() currentUser,
  ) {
    return await this.formService.updateForm(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async deleteFormInput(
    @Args("input") input: DeleteFormInput,
    @CurrentUser() currentUser,
  ) {
    return await this.formService.deleteForm(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async createQuestion(
    @Args("input") input: CreateQuestionInput,
    @CurrentUser() currentUser,
  ) {
    return await this.createQuestion(input, currentUser.userId);
  }

  @Mutation(() => SuccessResponse)
  @Allow()
  async updateQuestion(
    @Args("input") input: UpdateQuestionInput,
    @CurrentUser() currentUser,
  ){
    return await this.updateQuestion(input, currentUser.userId);
  }
}
