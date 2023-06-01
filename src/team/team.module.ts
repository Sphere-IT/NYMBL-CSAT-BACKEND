import { Module, forwardRef } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamResolver } from "./team.resolver";
import { TeamEntity } from "./entities";
import { AssignmentModule } from "src/assignment/assignment.module";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([TeamEntity]),
    forwardRef(() => AssignmentModule),
  ],
  providers: [TeamResolver, TeamService],
  exports: [TeamService],
})
export class TeamModule {}
