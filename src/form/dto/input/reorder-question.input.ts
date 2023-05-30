import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { REORDER_DIRECTION } from "src/form/constants";

registerEnumType(REORDER_DIRECTION, { name: "REORDER_DIRECTION" });
@InputType()
export class ReorderQuestionInput {
  @Field(() => Number)
  questionId: number;

  @Field(() => REORDER_DIRECTION)
  direction: REORDER_DIRECTION;
}
