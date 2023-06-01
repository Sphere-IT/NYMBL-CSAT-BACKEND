import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Table,
  Model,
  HasOne,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { AssignmentStatusEntity } from "./assignment-status.entity";
import { Association } from "sequelize";

@ObjectType()
@Table({ tableName: "assignments", underscored: true })
export class AssignmentEntity extends Model<AssignmentEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  @Field(() => Number)
  idAssignment: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @Field(() => Number)
  refIdForm: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @Field(() => Number)
  refIdTeamMember: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @Field(() => Number)
  refIdStatus: number;

  @Column({ type: DataType.STRING, allowNull: true })
  @Field(() => String)
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  @Field(() => String)
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  @Field(() => String)
  message: string;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  assignmentRef: string;

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

  // @OneToOne(() => FormEntity, {
  //   joinColumn: "ref_id_form",
  //   referenceColumnName: "id_form",
  //   nullable: true,
  // })
  // @Field(() => FormEntity, { nullable: true })
  // form?: FormEntity;

  // @OneToOne(() => AssignmentStatusEntity, {
  //   joinColumn: "ref_id_status",
  //   referenceColumnName: "id_status",
  //   nullable: true,
  // })
  // @Field(() => AssignmentStatusEntity, { nullable: true })
  // status?: AssignmentStatusEntity;

  @HasOne(() => AssignmentStatusEntity, {
    sourceKey: "refIdStatus",
    foreignKey: "idStatus",
  })
  @Field(() => AssignmentStatusEntity, { nullable: true })
  status?: AssignmentStatusEntity;
}
