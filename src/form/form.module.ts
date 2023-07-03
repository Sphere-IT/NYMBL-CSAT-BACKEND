import { Module } from "@nestjs/common";
import { FormService } from "./form.service";
import { FormResolver } from "./form.resolver";
import { FormEntity, QuestionEntity, QuestionTypeEntity } from "./entities";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([
      FormEntity,
      QuestionEntity,
      QuestionTypeEntity,
    ]),
  ],
  providers: [FormResolver, FormService],
  exports: [FormService],
})
export class FormModule {}
