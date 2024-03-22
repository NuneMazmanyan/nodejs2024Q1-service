import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as yaml from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const swagger = readFileSync('doc/api.yaml', { encoding: 'utf-8' });
  const parsedSwagger = yaml.parse(swagger);

  SwaggerModule.setup('doc', app, parsedSwagger);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
