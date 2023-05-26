import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAssignmentInput {
  @Field(() => Number)
  teamMemberId: number;

  @Field(() => Number)
  formId: number;
}
