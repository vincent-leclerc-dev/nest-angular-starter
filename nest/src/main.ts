require('module-alias/register');
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { description, keywords, name, version } from '../package.json';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // performance
  app.use(compression());

  // security
  app.use(helmet());

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      skipNullProperties: true,
      skipUndefinedProperties: false,
      transform: false,
      whitelist: true, // error thrown when any non-whitelisted property is found
    }),
  );

  // logger
  app.useLogger(app.get(Logger));

  // exception
  app.useGlobalInterceptors(new ExceptionInterceptor());

  // cross origin resource sharing
  app.enableCors();

  // documentation
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addTag(keywords.join(','))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
