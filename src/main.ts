import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: console,
    logger: ["debug", "error", "warn", "log", "verbose"],
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
