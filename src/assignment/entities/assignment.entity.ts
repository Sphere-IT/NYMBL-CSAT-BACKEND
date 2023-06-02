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
import { FormEntity } from "src/form/entities";

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
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  @Field(() => String, { nullable: true })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  @Field(() => String, { nullable: true })
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

  @HasOne(() => FormEntity, {
    sourceKey: "refIdForm",
    foreignKey: "idForm",
  })
  @Field(() => FormEntity, { nullable: true })
  form?: FormEntity;

  @HasOne(() => AssignmentStatusEntity, {
    sourceKey: "refIdStatus",
    foreignKey: "idStatus",
  })
  @Field(() => AssignmentStatusEntity, { nullable: true })
  status?: AssignmentStatusEntity;
}
