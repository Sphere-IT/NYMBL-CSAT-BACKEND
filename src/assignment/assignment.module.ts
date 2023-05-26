import { Module, forwardRef } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentResolver } from './assignment.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
} from './entities';
import { TeamModule } from 'src/team/team.module';
import { FormModule } from 'src/form/form.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [AssignmentEntity, AssignmentStatusEntity, SubmissionEntity],
    }),
    FormModule,
    forwardRef(() => TeamModule),
  ],
  providers: [AssignmentResolver, AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
