import { Field, ObjectType } from "@nestjs/graphql";
import { FormEntity } from "./form.entity";
import { QuestionTypeEntity } from "./question-type.entity";
import { Column, DataType, Table, Model, HasOne } from "sequelize-typescript";

@ObjectType()
@Table({ tableName: "question", underscored: true })
export class QuestionEntity extends Model<QuestionEntity> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  @Field(() => Number)
  idQuestion: number;

  @Column({
    type: DataType.INTEGER,
  })
  @Field(() => Number)
  refIdForm: number;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  questionDetails: string;

  @Column({
    type: DataType.NUMBER,
  })
  @Field(() => Number)
  questionOrder: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  @Field(() => Number, { nullable: true })
  refIdQuestionType: number;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String, { nullable: true, defaultValue: "Y" })
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

  // @ManyToOne(() => FormEntity, {
  //   nullable: true,
  //   joinColumn: "ref_id_form",
  //   referenceColumnName: "id_form",
  // })
  // @Field(() => FormEntity, { nullable: true })
  // form?: FormEntity;

  @HasOne(() => QuestionTypeEntity, "refIdQuestionType")
  @Field(() => QuestionTypeEntity, { nullable: true })
  questionType: QuestionTypeEntity;
}
