import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Table,
  Model,
  HasOne,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { AssignmentStatusEntity } from "./assignment-status.entity";
import { FormEntity } from "src/form/entities";

@ObjectType()
@Table({ tableName: "ASSIGNMENTS", underscored: true })
export class AssignmentEntity extends Model<AssignmentEntity> {
  @PrimaryKey
  @Column({
    type: DataType.NUMBER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID_ASSIGNMENT",
    unique: true,
  })
  @Field(() => Number)
  idAssignment: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
    field: "REF_ID_FORM",
  })
  @Field(() => Number)
  refIdForm: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
    field: "REF_ID_TEAM_MEMBER",
  })
  @Field(() => Number)
  refIdTeamMember: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
    field: "REF_ID_STATUS",
  })
  @Field(() => Number)
  refIdStatus: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "NAME",
  })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "PHONE",
  })
  @Field(() => String, { nullable: true })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "MESSAGE",
  })
  @Field(() => String, { nullable: true })
  message: string;

  @Column({
    type: DataType.STRING,
    field: "ASSIGNMENT_REF",
  })
  @Field(() => String)
  assignmentRef: string;

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

  @Column({
    type: DataType.DECIMAL(2, 8),
    allowNull: true,
    field: "FINAL_SCORE",
  })
  @Field(() => Number, { nullable: true })
  finalScore: number;

  @BelongsTo(() => FormEntity, "refIdForm")
  @Field(() => FormEntity, { nullable: true })
  form?: FormEntity;

  @HasOne(() => AssignmentStatusEntity, {
    sourceKey: "refIdStatus",
    foreignKey: "idStatus",
  })
  @Field(() => AssignmentStatusEntity, { nullable: true })
  status?: AssignmentStatusEntity;
}
