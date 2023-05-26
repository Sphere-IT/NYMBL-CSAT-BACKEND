import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/dto/args';
import { TeamEntity } from 'src/team/entities';

@ObjectType()
export class FilterTeamResponse extends PaginatedResponse(TeamEntity) {}
