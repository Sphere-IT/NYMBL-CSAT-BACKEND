import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { TeamModule } from './team/team.module';
import { AssignmentModule } from './assignment/assignment.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { entities } from './common/config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cnf: ConfigService) => {
        return {
          entities: [...entities],
          dbName: cnf.get('DB_NAME'),
          host: cnf.get('DB_HOST'),
          type: cnf.get('DB_DRIVER'),
          password: cnf.get('DB_PASSWORD'),
          user: cnf.get('DB_USER'),
        };
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
      playground: true,
    }),
    TeamModule,
    AssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
