import { Field, ObjectType } from "@nestjs/graphql";
import { AssignmentStatusEntity } from "src/assignment/entities";
import { QuestionEntity } from "src/form/entities";

@ObjectType()
export class GetAssignmentResponse {
  @Field(() => String)
  assignmentRef: string;

  @Field(() => AssignmentStatusEntity)
  status: AssignmentStatusEntity;

  @Field(() => [QuestionEntity])
  questions: QuestionEntity[];

  @Field(() => QuestionEntity, { nullable: true })
  currentQuestion?: QuestionEntity;
}
