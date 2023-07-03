import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AssignmentReportInput {
  @Field(() => Number)
  formId: number;

  @Field(() => [Date, Date], { nullable: true })
  betweenDates?: [Date, Date];

  @Field(() => [Number, Number], { nullable: true })
  betweenScore?: [number, number];

  @Field(() => Number, { nullable: true })
  teamMemberId?: number;
}
