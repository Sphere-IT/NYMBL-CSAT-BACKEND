import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ApolloDriver } from "@nestjs/apollo";
import { TeamModule } from "./team/team.module";
import { AssignmentModule } from "./assignment/assignment.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { entities } from "./common/config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { FormModule } from "./form/form.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cnf: ConfigService) => {
        return {
          entities: [...entities],
          dbName: cnf.get("DB_NAME"),
          host: cnf.get("DB_HOST"),
          type: cnf.get("DB_DRIVER"),
          password: cnf.get("DB_PASSWORD"),
          user: cnf.get("DB_USER"),
          debug: true,
          // logger: true,
          // logger: console.log,
        };
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      driver: ApolloDriver,
      playground: true,
    }),
    TeamModule,
    AssignmentModule,
    AuthModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
