import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMovieDto {
    @ApiProperty({
        description: 'The title of the movie',
        example: 'The Shawshank Redemption',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    title: string;
  
    @ApiProperty({
        description: 'The year the movie was published/released',
        example: 1994,
        minimum: 1888,
        maximum: 2030
    })
    @IsNumber()
    publishingYear: number;
  
    @ApiProperty({
        description: 'URL to the movie poster image',
        example: 'https://example.com/poster.jpg',
        format: 'uri'
    })
    @IsString()
    posterUrl: string;
}
  
export class UpdateMovieDto {
    @ApiPropertyOptional({
        description: 'The title of the movie',
        example: 'The Shawshank Redemption',
        minLength: 1,
        maxLength: 255
    })
    @IsOptional()
    @IsString()
    title?: string;
  
    @ApiPropertyOptional({
        description: 'The year the movie was published/released',
        example: 1994,
        minimum: 1888,
        maximum: 2030
    })
    @IsOptional()
    @IsNumber()
    publishingYear?: number;
  
    @ApiPropertyOptional({
        description: 'URL to the movie poster image',
        example: 'https://example.com/poster.jpg',
        format: 'uri'
    })
    @IsOptional()
    @IsString()
    posterUrl?: string;
}

export class MovieResponseDto {
    @ApiProperty({
        description: 'Unique identifier for the movie',
        example: '507f1f77bcf86cd799439011'
    })
    _id: string;

    @ApiProperty({
        description: 'The title of the movie',
        example: 'The Shawshank Redemption'
    })
    title: string;

    @ApiProperty({
        description: 'The year the movie was published/released',
        example: 1994
    })
    publishingYear: number;

    @ApiProperty({
        description: 'URL to the movie poster image',
        example: 'https://example.com/poster.jpg'
    })
    posterUrl: string;

    @ApiProperty({
        description: 'When the movie was created',
        example: '2024-01-15T10:30:00.000Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'When the movie was last updated',
        example: '2024-01-15T10:30:00.000Z'
    })
    updatedAt: Date;
}

export class PaginatedMoviesResponseDto {
    @ApiProperty({
        description: 'Array of movies',
        type: [MovieResponseDto]
    })
    movies: MovieResponseDto[];

    @ApiProperty({
        description: 'Current page number',
        example: 1
    })
    page: number;

    @ApiProperty({
        description: 'Number of movies per page',
        example: 10
    })
    limit: number;

    @ApiProperty({
        description: 'Total number of movies',
        example: 100
    })
    total: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 10
    })
    totalPages: number;
}
