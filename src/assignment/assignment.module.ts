import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentResolver } from './assignment.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  AssignmentEntity,
  AssignmentStatusEntity,
  SubmissionEntity,
} from './entities';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [AssignmentEntity, AssignmentStatusEntity, SubmissionEntity],
    }),
  ],
  providers: [AssignmentResolver, AssignmentService],
})
export class AssignmentModule {}
