import { Controller, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNotEmpty } from 'class-validator';
import { CloudinaryService } from './cloudinary.service';

export class GetSignedUrlDto {
  @ApiProperty({ example: 'movie-poster.jpg' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  fileType: string;
}

export class SignedUrlResponseDto {
  url: string;
}

export class UploadSignatureResponse {
  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/file.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&...' })
  signature: string;
  timestamp: number;
  cloudName: string|undefined;
  folder: string;
}

export class DeleteFileResponseDto {
  @ApiProperty({ example: 'File deleted successfully' })
  message: string;
}

@ApiTags('File Management')
@Controller('s3')
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class S3Controller {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get signed URL for file upload' })
  @ApiResponse({ status: 200, type: UploadSignatureResponse })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSignedUrl(@Body() dto: GetSignedUrlDto): Promise<UploadSignatureResponse> {
    return this.cloudinaryService.generateUploadSignature("movies");
  }
} 