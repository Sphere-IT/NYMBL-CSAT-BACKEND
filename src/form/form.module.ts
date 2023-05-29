import { Module } from "@nestjs/common";
import { FormService } from "./form.service";
import { FormResolver } from "./form.resolver";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { FormEntity, QuestionEntity } from "./entities";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [FormEntity, QuestionEntity] }),
  ],
  providers: [FormResolver, FormService],
  exports: [FormService],
})
export class FormModule {}
