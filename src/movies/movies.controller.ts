import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto, MovieResponseDto, PaginatedMoviesResponseDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @Get()
    @ApiOperation({ 
        summary: 'Get all movies',
        description: 'Retrieve a paginated list of all movies. Requires authentication.'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination (starts from 1)',
        example: 1,
        type: Number
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of movies per page (default: 10)',
        example: 10,
        type: Number
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Successfully retrieved movies',
        type: PaginatedMoviesResponseDto
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized - Invalid or missing authentication token'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Internal server error'
    })
    getAll(@Query('page') page: number, @Query('limit') limit: number) {
        return this.moviesService.findAll(page, limit);
    }

    @Post()
    @ApiOperation({ 
        summary: 'Create a new movie',
        description: 'Create a new movie with title, publishing year, and poster URL. Requires authentication.'
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Movie created successfully',
        type: MovieResponseDto
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Bad request - Invalid input data'
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized - Invalid or missing authentication token'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Internal server error'
    })
    createMovie(@Body() dto: CreateMovieDto) {
        return this.moviesService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ 
        summary: 'Update a movie',
        description: 'Update an existing movie by ID. Only provided fields will be updated. Requires authentication.'
    })
    @ApiParam({
        name: 'id',
        description: 'Movie unique identifier',
        example: '507f1f77bcf86cd799439011',
        type: String
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Movie updated successfully',
        type: MovieResponseDto
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Bad request - Invalid input data'
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized - Invalid or missing authentication token'
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Movie not found'
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Internal server error'
    })
    updateMovie(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
        return this.moviesService.update(id, dto);
    }
}
