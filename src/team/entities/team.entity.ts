import { Field, ObjectType } from "@nestjs/graphql";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@ObjectType()
@Table({ tableName: "team_member", underscored: true })
export class TeamEntity extends Model<TeamEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  @Field(() => Number, { nullable: true })
  idTeamMember: number;

  @Column(DataType.STRING)
  @Field(() => String)
  firstName: string;

  @Column(DataType.STRING)
  @Field(() => String)
  lastName: string;

  @Column(DataType.STRING)
  @Field(() => String)
  contact: string;

  @Column(DataType.STRING)
  @Field(() => String)
  email: string;

  @Column(DataType.STRING)
  @Field(() => String, { nullable: true })
  username: string;

  @Column(DataType.STRING)
  @Field(() => String)
  password: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @Field(() => Number, { nullable: true })
  refIdDepartment?: number;

  @Column({
    type: DataType.CHAR,
  })
  @Field(() => String, { nullable: true })
  isActive?: "Y" | "N";

  @Column(DataType.DATE)
  @Field(() => Date)
  createdAt?: Date;

  @Column(DataType.STRING)
  @Field(() => String)
  createdBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @Field(() => String, { nullable: true })
  updatedBy: string;
}
