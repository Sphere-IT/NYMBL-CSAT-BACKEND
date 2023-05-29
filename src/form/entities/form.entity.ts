import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/entities";
import { QuestionEntity } from "./question.entity";

@ObjectType()
@Entity({ tableName: "form" })
export class FormEntity extends BaseEntity {
  @Property({ nullable: false, primary: true, autoincrement: true })
  @Field(() => Number)
  idForm: number;

  @Property()
  @Field(() => String)
  formName: string;

  @Property()
  @Field(() => Boolean)
  formIsActive?: boolean;

  @OneToMany(() => QuestionEntity, (q) => q.form, { nullable: true })
  @Field(() => [QuestionEntity], { nullable: true })
  questions? = new Collection<QuestionEntity>(this);
}
