import { Args, Query, Resolver } from "@nestjs/graphql";
import { FormService } from "./form.service";
import { FormEntity } from "./entities";
import { Allow } from "src/common/decorators";
import { FilterFormResponse } from "./dto/args";
import { FormListingInput } from "./dto/input";

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
}
