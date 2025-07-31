import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMovieDto {
    @ApiProperty({ example: 'The Shawshank Redemption', minLength: 1, maxLength: 255 })
    @IsString()
    title: string;
  
    @ApiProperty({ example: 1994, minimum: 1888, maximum: 2030 })
    @IsNumber()
    publishingYear: number;
  
    @ApiProperty({ example: 'https://example.com/poster.jpg' })
    @IsString()
    posterUrl: string;
}
  
export class UpdateMovieDto {
    @ApiPropertyOptional({ example: 'The Shawshank Redemption', minLength: 1, maxLength: 255 })
    @IsOptional()
    @IsString()
    title?: string;
  
    @ApiPropertyOptional({ example: 1994, minimum: 1888, maximum: 2030 })
    @IsOptional()
    @IsNumber()
    publishingYear?: number;
  
    @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
    @IsOptional()
    @IsString()
    posterUrl?: string;
}

export class MovieResponseDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    _id: string;

    @ApiProperty({ example: 'The Shawshank Redemption' })
    title: string;

    @ApiProperty({ example: 1994 })
    publishingYear: number;

    @ApiProperty({ example: 'https://example.com/poster.jpg' })
    posterUrl: string;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    updatedAt: Date;
}

export class PaginatedMoviesResponseDto {
    @ApiProperty({ type: [MovieResponseDto] })
    movies: MovieResponseDto[];

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 10 })
    limit: number;

    @ApiProperty({ example: 100 })
    total: number;

    @ApiProperty({ example: 10 })
    totalPages: number;
}
