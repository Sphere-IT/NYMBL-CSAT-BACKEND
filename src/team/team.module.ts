import { Module, forwardRef } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TeamEntity } from './entities';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { AssignmentService } from 'src/assignment/assignment.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamEntity]),
    forwardRef(() => AssignmentModule),
  ],
  providers: [TeamResolver, TeamService],
  exports: [TeamService],
})
export class TeamModule {}
