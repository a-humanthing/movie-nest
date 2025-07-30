import { Controller, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetSignedUrlDto {
  @ApiProperty({
    description: 'Name of the file to upload',
    example: 'movie-poster.jpg',
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  fileType: string;
}

export class SignedUrlResponseDto {
  @ApiProperty({
    description: 'Pre-signed URL for file upload',
    example: 'https://s3.amazonaws.com/bucket/file.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&...'
  })
  url: string;
}

export class DeleteFileResponseDto {
  @ApiProperty({
    description: 'Deletion confirmation message',
    example: 'File deleted successfully'
  })
  message: string;
}

@ApiTags('File Management')
@Controller('s3')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload-url')
  @ApiOperation({
    summary: 'Get signed URL for file upload',
    description: 'Generate a pre-signed URL for uploading files directly to S3. The URL is valid for 10 minutes.'
  })
  @ApiResponse({
    status: 200,
    description: 'Signed URL generated successfully',
    type: SignedUrlResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file information'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - S3 configuration issue'
  })
  async getSignedUrl(@Body() dto: GetSignedUrlDto): Promise<SignedUrlResponseDto> {
    return this.s3Service.getSignedUrl(dto.fileName, dto.fileType);
  }

  @Delete('files/:key')
  @ApiOperation({
    summary: 'Delete file from S3',
    description: 'Delete a file from S3 storage using the file key.'
  })
  @ApiParam({
    name: 'key',
    description: 'S3 file key (path) to delete',
    example: 'uploads/movie-poster.jpg',
    type: String
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    type: DeleteFileResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiResponse({
    status: 404,
    description: 'File not found in S3'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - S3 operation failed'
  })
  async deleteFile(@Param('key') key: string): Promise<DeleteFileResponseDto> {
    return this.s3Service.deleteFile(key);
  }
} 