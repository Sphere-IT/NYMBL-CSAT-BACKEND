import { Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Property()
  @Field(() => String)
  createdBy: string;

  @Property()
  @Field(() => Date)
  createdDate: Date;

  @Property({ nullable: true })
  @Field(() => String, { nullable: true })
  updatedBy: string;

  @Property({ nullable: true })
  @Field(() => Date, { nullable: true })
  updatedDate?: Date;
}
