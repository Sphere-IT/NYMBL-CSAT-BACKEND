import {
  Field,
  FieldMiddleware,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from "@nestjs/graphql";

const jsonPareMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  console.log("\n\n\n\n\n", value, "\n\n\n\n\n\n");
  return JSON.parse(value);
};

@ObjectType()
class TopPerformingAgentObject {
  @Field(() => Number)
  teamMemberId: number;

  @Field(() => String)
  name: string;

  @Field(() => Number)
  averageScore: number;
}

@ObjectType()
class StatusTotalsObject {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  value: number;
}

@ObjectType()
class SurveyResponseRateObject {
  @Field(() => Number)
  totalSurveys: number;

  @Field(() => Number)
  differencePercentage: number;

  @Field(() => [StatusTotalsObject])
  statusTotals: StatusTotalsObject[];
}

@ObjectType()
class OverallSatisfactionObject {
  @Field(() => Number)
  value: number;

  @Field(() => String)
  name: string;
}

@ObjectType()
class QuestionTotalSelectionDataObject {
  @Field(() => String)
  label: string;

  @Field(() => Number)
  total: number;
}

@ObjectType()
class QuestionTotalSelectionDataSetsObject {
  @Field(() => String)
  label: string;

  @Field(() => [QuestionTotalSelectionDataObject], {
    middleware: [jsonPareMiddleware],
  })
  data: QuestionTotalSelectionDataObject[];
}

@ObjectType()
class QuestionTotalSelectionObject {
  @Field(() => [String])
  labels: string[];

  @Field(() => [QuestionTotalSelectionDataSetsObject])
  dataSets: QuestionTotalSelectionDataSetsObject[];
}

@ObjectType()
class AverageQuarterlyScoreObject {
  @Field(() => Number)
  averageScore: number;

  @Field(() => String)
  label: string;
}

@ObjectType()
export class GetFormStatsResponse {
  @Field(() => [OverallSatisfactionObject])
  overallSatisfaction: OverallSatisfactionObject[];

  @Field(() => SurveyResponseRateObject)
  surveyResponse: SurveyResponseRateObject;

  @Field(() => QuestionTotalSelectionObject)
  questionTotalSelection: QuestionTotalSelectionObject;

  @Field(() => [TopPerformingAgentObject])
  topPerformingAgents: TopPerformingAgentObject[];

  @Field(() => [AverageQuarterlyScoreObject])
  averageQuarterlyScore: AverageQuarterlyScoreObject[];

  @Field(() => Number)
  nps: number;
}
