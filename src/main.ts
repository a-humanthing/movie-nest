import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ 
    stopAtFirstError: true,
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Movie Hub API')
    .setDescription(`
      A comprehensive movie management API built with NestJS.
      
      ## Features
      - **Authentication**: JWT-based authentication with refresh tokens
      - **Movie Management**: CRUD operations for movies with pagination
      - **File Management**: S3 integration for file uploads and management
      - **User Management**: User profiles and account management
      
      ## Authentication
      Most endpoints require authentication. Include the JWT token in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
      
      
      ## Error Handling
      The API returns standard HTTP status codes and detailed error messages.
    `)
    .setVersion('1.0.0')
    .addTag('System', 'System health and information endpoints')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Movies', 'Movie management endpoints')
    .addTag('File Management', 'File upload and management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for @ApiBearerAuth() decorator
    )
    .addServer(process.env.HOST||'http://localhost:3000')
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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();
