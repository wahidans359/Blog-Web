import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true, // throws error if extra fields are present
      transform: true, // auto-transform payloads to DTO classes
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
