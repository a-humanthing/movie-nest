import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 3600 })
  uptime: number;

  @ApiProperty({ example: 'development' })
  environment: string;
}

export class ApiInfoResponseDto {
  @ApiProperty({ example: 'Movie Hub API' })
  name: string;

  @ApiProperty({ example: '1.0.0' })
  version: string;

  @ApiProperty({ example: 'A comprehensive movie management API built with NestJS' })
  description: string;

  @ApiProperty({
    type: 'object',
    properties: {
      auth: { type: 'string', example: '/auth - Authentication endpoints' },
      movies: { type: 'string', example: '/movies - Movie management endpoints' },
      s3: { type: 'string', example: '/s3 - File management endpoints' },
      swagger: { type: 'string', example: '/api - Interactive API documentation' }
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
  constructor() {}

  @Get()
  @ApiOperation({ summary: 'API Health Check' })
  @ApiResponse({ status: 200, type: HealthCheckResponseDto })
  getHealthCheck(): HealthCheckResponseDto {
    const startTime = process.uptime();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(startTime),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'API Information' })
  @ApiResponse({ status: 200, type: ApiInfoResponseDto })
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
