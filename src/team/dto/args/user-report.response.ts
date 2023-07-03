import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserReportResponse {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => Float)
  averageScore: number;
}
