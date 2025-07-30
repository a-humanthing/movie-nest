import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({
    description: 'Health status of the API',
    example: 'ok'
  })
  status: string;

  @ApiProperty({
    description: 'Current timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'API uptime in seconds',
    example: 3600
  })
  uptime: number;

  @ApiProperty({
    description: 'Current environment',
    example: 'development'
  })
  environment: string;
}

export class ApiInfoResponseDto {
  @ApiProperty({
    description: 'API name',
    example: 'Movie Hub API'
  })
  name: string;

  @ApiProperty({
    description: 'API version',
    example: '1.0.0'
  })
  version: string;

  @ApiProperty({
    description: 'API description',
    example: 'A comprehensive movie management API built with NestJS'
  })
  description: string;

  @ApiProperty({
    description: 'Available API endpoints',
    type: 'object',
    properties: {
      auth: {
        type: 'string',
        description: 'Authentication endpoints',
        example: '/auth - Authentication endpoints (login, logout, refresh, profile)'
      },
      movies: {
        type: 'string',
        description: 'Movie management endpoints',
        example: '/movies - Movie management endpoints (CRUD operations)'
      },
      s3: {
        type: 'string',
        description: 'File management endpoints',
        example: '/s3 - File management endpoints (upload, delete)'
      },
      swagger: {
        type: 'string',
        description: 'API documentation',
        example: '/api - Interactive API documentation'
      }
    }
  })
  endpoints: {
    auth: string;
    movies: string;
    s3: string;
    swagger: string;
  };
}

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API Health Check',
    description: 'Check if the API is running and healthy'
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    type: HealthCheckResponseDto
  })
  getHealthCheck(): HealthCheckResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('info')
  @ApiOperation({
    summary: 'API Information',
    description: 'Get information about the API and available endpoints'
  })
  @ApiResponse({
    status: 200,
    description: 'API information retrieved successfully',
    type: ApiInfoResponseDto
  })
  getApiInfo(): ApiInfoResponseDto {
    return {
      name: 'Movie Hub API',
      version: '1.0.0',
      description: 'A comprehensive movie management API built with NestJS',
      endpoints: {
        auth: '/auth - Authentication endpoints (login, logout, refresh, profile)',
        movies: '/movies - Movie management endpoints (CRUD operations)',
        s3: '/s3 - File management endpoints (upload, delete)',
        swagger: '/api - Interactive API documentation'
      }
    };
  }
}
