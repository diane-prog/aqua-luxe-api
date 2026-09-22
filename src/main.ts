import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors';
import { CustomValidationPipe } from './common/response';
import { createWinstonLogger } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger(),
  });

  const configService = app.get(ConfigService);

  app.use(helmet());

  const corsOrigins = configService.get<string>('CORS_ORIGINS', '*');
  app.enableCors({
    origin: corsOrigins.split(',').map((o) => o.trim()),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new CustomValidationPipe(),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'swagger', 'swagger-json'],
  });

  if (configService.get<string>('ENABLE_SWAGGER', 'true') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('PoolBk API')
      .setDescription('API for Pooluxe - Pool Construction & Maintenance')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management (admin)')
      .addTag('Roles', 'Role management (admin)')
      .addTag('Permissions', 'Permission management (admin)')
      .addTag('Services', 'Pool services (construction, renovation, maintenance...)')
      .addTag('Packages', 'Pricing packages / forfaits')
      .addTag('Projects', 'Portfolio of completed projects')
      .addTag('Project Categories', 'Project categories')
      .addTag('Testimonials', 'Client testimonials / reviews')
      .addTag('Team', 'Team members')
      .addTag('Process Steps', 'Our process steps')
      .addTag('Why Choose Us', 'Why choose us section')
      .addTag('FAQ', 'Frequently asked questions')
      .addTag('Blog', 'Blog posts')
      .addTag('Blog Categories', 'Blog categories')
      .addTag('Pages', 'Static pages')
      .addTag('Contact Messages', 'Contact form submissions')
      .addTag('Quote Requests', 'Quote / project request submissions')
      .addTag('Newsletter', 'Newsletter subscriptions')
      .addTag('Settings', 'Global site settings')
      .addTag('Dashboard', 'Admin dashboard statistics')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'PoolBk API Documentation',
    });
  }

  app.use('/health', async (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/swagger`);
}
bootstrap();
