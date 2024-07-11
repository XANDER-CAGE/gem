import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './common/config/swagger.config';
import { env } from './common/config/env.config';
import { ValidationPipe } from '@nestjs/common';

const api = `http://${env.API_HOST}:${env.PORT}`;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'fatal', 'warn', 'verbose'],
  });
  app.setGlobalPrefix('api');
  if (env.isDevelopment || env.isTest) {
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('swagger', app, document);
    console.log(`Swagger -  ${api}/swagger`);
  }
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(env.PORT || 3000);
}
bootstrap().then(() => console.log('API runnning on port ', env.PORT));
