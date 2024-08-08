import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Gem 💎')
  .addBearerAuth({
    name: 'authorization',
    type: 'apiKey',
    in: 'header',
  })
  .build();
