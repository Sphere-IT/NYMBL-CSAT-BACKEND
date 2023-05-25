import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities';

@ObjectType()
@Entity({ tableName: 'form' })
export class FormEntity extends BaseEntity {
  @Property({ nullable: false, primary: true, autoincrement: true })
  @Field(() => Number)
  idForm: number;

  @Property()
  @Field(() => String)
  formName: string;

  @Property()
  @Field(() => Boolean)
  formIsActive?: boolean;
}
