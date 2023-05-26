import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ tableName: 'team_member' })
export class TeamEntity {
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
}
