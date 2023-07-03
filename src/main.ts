import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: console,
    logger: ["debug", "error", "warn", "log", "verbose"],
  });
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors();
  await app.listen(configService.get("APP_PORT"));
}
bootstrap();
