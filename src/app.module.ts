import { HttpStatus, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ApolloDriver } from "@nestjs/apollo";
import { TeamModule } from "./team/team.module";
import { AssignmentModule } from "./assignment/assignment.module";
import { entities } from "./common/config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { FormModule } from "./form/form.module";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { SequelizeModule } from "@nestjs/sequelize";
import * as oracledb from "oracledb";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (cnf: ConfigService) => {
        oracledb.initOracleClient();

        return {
          dialect: "oracle",
          host: cnf.get("DB_HOST"),
          port: cnf.get("DB_PORT"),
          username: cnf.get("DB_USER"),
          password: cnf.get("DB_PASSWORD"),
          database: cnf.get("DB_NAME"),
          models: [...entities],
          synchronize: false,
        };
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), "schema.gql"),
      sortSchema: true,
      driver: ApolloDriver,
      playground: true,
      introspection: true,
      fieldResolverEnhancers: ["interceptors"],
      formatError: (error: GraphQLError | any) => {
        console.log(
          JSON.stringify(error),
          error?.extensions?.response?.message,
        );
        const graphQLFormattedError: GraphQLFormattedError & {
          status: HttpStatus;
        } = {
          status:
            error?.extensions?.response?.statusCode ||
            HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error?.extensions?.response?.message ||
            error?.message ||
            "Something went wrong",
        };
        return graphQLFormattedError;
      },
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
