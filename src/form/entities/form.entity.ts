import { Field, ObjectType } from "@nestjs/graphql";
import { QuestionEntity } from "./question.entity";
import {
  Column,
  DataType,
  Table,
  Model,
  PrimaryKey,
  HasMany,
  AutoIncrement,
} from "sequelize-typescript";

@ObjectType()
@Table({ tableName: "FORM", underscored: true })
export class FormEntity extends Model<FormEntity> {
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  //   autoIncrement: true,
  // })
  @Column({
    field: "ID_FORM",
    type: DataType.NUMBER,
    autoIncrement: true,
    primaryKey: true,
  })
  @Field(() => Number)
  idForm: number;

  @Column({
    type: DataType.STRING,
    field: "FORM_NAME",
  })
  @Field(() => String)
  formName: string;

  @Column({
    type: DataType.STRING,
    field: "FORM_IS_ACTIVE",
    defaultValue: "Y",
  })
  @Field(() => String)
  formIsActive?: "Y" | "N";

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

  @HasMany(() => QuestionEntity, "refIdForm")
  @Field(() => [QuestionEntity], { nullable: true })
  questions?: QuestionEntity[];
}
