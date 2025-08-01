import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ 
    stopAtFirstError: true,
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 422
  }));

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Movie Hub API')
    .setDescription(`
      A production-ready movie management API built with NestJS.
      
      ## Features
      - JWT-based authentication with refresh tokens
      - CRUD operations for movies with pagination
      - S3 integration for file management
      - User management and profiles
      
      ## Authentication
      Include JWT token in Authorization header: \`Bearer <token>\`
    `)
    .setVersion('1.0.0')
    .addTag('System', 'Health check and API information')
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Movies', 'Movie management endpoints')
    .addTag('File Management', 'S3 file operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer(process.env.HOST || 'http://localhost:3000')
    .build();
    const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      }
    },
    customSiteTitle: 'Movie Hub API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6; }
      .swagger-ui .scheme-container { background: #f8fafc; }
    `,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  
  console.log(`🚀 Movie Hub API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
