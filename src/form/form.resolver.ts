import { Query, Resolver } from '@nestjs/graphql';
import { FormService } from './form.service';

@Resolver()
export class FormResolver {
  constructor(private readonly formService: FormService) {}
}
