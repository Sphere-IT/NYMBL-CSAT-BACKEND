import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities';

@ObjectType()
@Entity({ tableName: 'team_member' })
export class TeamEntity extends BaseEntity {
  @Property({ autoincrement: true, primary: true })
  @Field(() => Number, { nullable: true })
  idTeamMember?: number;

  @Property()
  @Field(() => String)
  firstName: string;

  @Property()
  @Field(() => String)
  lastName: string;

  @Property()
  @Field(() => String)
  contact: string;

  @Property()
  @Field(() => String)
  email: string;

  @Property()
  @Field(() => String)
  username: string;

  @Property()
  @Field(() => String)
  password: string;

  @Property()
  @Field(() => Number, { nullable: true })
  refIdDepartment?: number;

  @Property()
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isActive?: boolean;
}
