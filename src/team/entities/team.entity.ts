import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { USER_TYPES } from "../constants";

@ObjectType()
@Table({ tableName: "TEAM_MEMBER", timestamps: false })
export class TeamEntity extends Model<TeamEntity> {
  @PrimaryKey
  @Column({
    type: DataType.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_TEAM_MEMBER",
    unique: true,
  })
  @Field(() => Number, { nullable: true })
  idTeamMember: number;

  @Column({
    type: DataType.STRING,
    field: "FIRST_NAME",
  })
  @Field(() => String)
  firstName: string;

  @Column({
    type: DataType.STRING,
    field: "LAST_NAME",
  })
  @Field(() => String)
  lastName: string;

  @Column({
    type: DataType.STRING,
    field: "CONTACT",
  })
  @Field(() => String)
  contact: string;

  @Column({
    type: DataType.STRING,
    field: "EMAIL",
  })
  @Field(() => String)
  email: string;

  @Column({
    type: DataType.STRING,
    field: "USERNAME",
  })
  @Field(() => String, { nullable: true })
  username: string;

  @Column({
    type: DataType.STRING,
    field: "PASSWORD",
  })
  @Field(() => String)
  password: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
    field: "REF_ID_DEPARTMENT",
  })
  @Field(() => Number, { nullable: true })
  refIdDepartment?: number;

  @Column({
    type: DataType.STRING,
    field: "IS_ACTIVE",
  })
  @Field(() => String, { nullable: true })
  isActive?: string;

  @Column({
    type: DataType.STRING,
    field: "USER_TYPE",
  })
  @Field(() => USER_TYPES)
  userType: USER_TYPES;

  @Column({
    type: DataType.DATE,
    field: "CREATED_AT",
  })
  @Field(() => Date)
  createdAt?: Date;

  @Column({
    type: DataType.STRING,
    field: "CREATED_BY",
  })
  @Field(() => String)
  createdBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "UPDATED_AT",
  })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "UPDATED_BY",
  })
  @Field(() => String, { nullable: true })
  updatedBy: string;
}
