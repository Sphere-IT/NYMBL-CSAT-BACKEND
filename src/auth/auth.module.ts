import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { TeamService } from "src/team/team.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { TeamEntity } from "src/team/entities";
import { TeamModule } from "src/team/team.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    // MikroOrmModule.forFeature({ entities: [TeamEntity] }),
    PassportModule,
    TeamModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cnf: ConfigService) => {
        return {
          secret: cnf.get("JWT_SECRET"),
          signOptions: {
            expiresIn: cnf.get("JWT_EXPIRATION"),
          },
        };
      },
    }),
  ],
  providers: [
    ConfigService,
    AuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
