import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Remember user login (extends session duration)',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  rememberMe?: boolean = false;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiPropertyOptional({
    description: 'JWT refresh token for getting new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'User unique identifier',
        example: '507f1f77bcf86cd799439011'
      },
      email: {
        type: 'string',
        description: 'User email address',
        example: 'user@example.com'
      },
      name: {
        type: 'string',
        description: 'User full name',
        example: 'John Doe'
      }
    }
  })
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout confirmation message',
    example: 'Successfully logged out'
  })
  message: string;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'When the user was created',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the user was last updated',
    example: '2024-01-15T10:30:00.000Z'
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'When the user last logged in',
    example: '2024-01-15T10:30:00.000Z'
  })
  lastLogin?: Date;
}