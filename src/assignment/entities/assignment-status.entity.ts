import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { AssignmentEntity } from "./assignment.entity";

@ObjectType()
@Table({ tableName: "ASSIGNMENT_STATUS", underscored: true, timestamps: false })
export class AssignmentStatusEntity extends Model<AssignmentStatusEntity> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    field: "ID_STATUS",
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  @Field(() => Number)
  idStatus: number;

  @Column({
    type: DataType.STRING,
    field: "STATUS_CODE",
    unique: true,
  })
  @Field(() => String)
  statusCode: string;

  @Column({
    type: DataType.STRING,
    field: "STATUS_NAME",
  })
  @Field(() => String)
  statusName: string;

  @BelongsTo(() => AssignmentEntity, "idStatus")
  assignment: AssignmentEntity;
}
