import { AllExceptionsFilter } from '@filters/http-exception.filter';
import { PrismaExceptionFilter } from '@filters/prisma-exception.filter';
import { ResponseInterceptor } from '@interceptors/response.interceptor';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TrimPipe } from '@pipes/trim.pipe';
import helmet from 'helmet';
import { AppModule } from './app.module';

function mapValidationErrors(
  errors: ValidationError[],
  parentPath?: string,
): Record<string, any> {
  return errors.reduce(
    (result, error) => {
      const path = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;
      if (error.children && error.children.length > 0) {
        Object.assign(result, mapValidationErrors(error.children, path));
      } else {
        result[path] = Object.values(error.constraints || {});
      }

      return result;
    },
    {} as Record<string, string[]>,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS')?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        contentSecurityPolicy: null,
        upgradeInsecureRequests: null,
      },
    }),
  );

  app.useGlobalPipes(
    new TrimPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,

      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: mapValidationErrors(errors),
        });
      },
    }),
  );

  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalFilters(new PrismaExceptionFilter(), new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Lumii API')
    .setDescription('Lumii application API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(process.env);

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
