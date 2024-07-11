import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './common/config/swagger.config';
import { env } from './common/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (env.isDevelopment || env.isTest) {
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('swagger', app, document);
  }
  await app.listen(env.PORT || 3000);
}
bootstrap().then(() =>
  console.log(`http://${env.API_HOST}:${env.PORT}/swagger`),
);
