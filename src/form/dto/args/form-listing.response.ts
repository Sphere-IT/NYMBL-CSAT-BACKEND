import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/dto/args';
import { FormEntity } from 'src/form/entities';

@ObjectType()
export class FilterFormResponse extends PaginatedResponse(FormEntity) {}
