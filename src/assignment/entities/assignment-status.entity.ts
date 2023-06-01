import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
  HasMany,
  BelongsTo,
} from "sequelize-typescript";
import { AssignmentEntity } from "./assignment.entity";

@ObjectType()
@Table({ tableName: "assignment_status", underscored: true, timestamps: false })
export class AssignmentStatusEntity extends Model<AssignmentStatusEntity> {
  @Column({
    type: DataType.STRING,
    field: "id_status",
    primaryKey: true,
    autoIncrement: true,
  })
  @Field(() => Number)
  idStatus: number;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  statusCode: string;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  statusName: string;

  @BelongsTo(() => AssignmentEntity, "idStatus")
  assignment: AssignmentEntity;
}
