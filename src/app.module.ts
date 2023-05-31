import { HttpStatus, Module } from "@nestjs/common";
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
import { GraphQLError, GraphQLFormattedError } from "graphql";

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
          timezone: "UTC",
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
      fieldResolverEnhancers: ["interceptors"],
      formatError: (error: GraphQLError | any) => {
        // GraphQLError type
        // => format errors
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
