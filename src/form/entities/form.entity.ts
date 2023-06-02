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
@Table({ tableName: "form", underscored: true })
export class FormEntity extends Model<FormEntity> {
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  //   autoIncrement: true,
  // })
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field(() => Number)
  idForm: number;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  formName: string;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  formIsActive?: "Y" | "N";

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

  @HasMany(() => QuestionEntity, "refIdForm")
  @Field(() => [QuestionEntity], { nullable: true })
  questions?: QuestionEntity[];
}
