import { Query, Resolver } from '@nestjs/graphql';
import { FormService } from './form.service';
import { FormEntity } from './entities';
import { Allow } from 'src/common/decorators';

@Resolver()
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Query(() => [FormEntity])
  @Allow()
  getAllForms() {
    return this.formService.getAllForms();
  }
}
