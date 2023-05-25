import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TeamEntity } from './entities';

@Module({
  imports: [MikroOrmModule.forFeature([TeamEntity])],
  providers: [TeamResolver, TeamService],
})
export class TeamModule {}
