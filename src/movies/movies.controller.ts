import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
    @ApiOperation({ summary: 'Get all movies' })
    @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
    @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
    @ApiResponse({ status: 200, type: PaginatedMoviesResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getAll(@Query('page') page: number, @Query('limit') limit: number) {
        return this.moviesService.findAll(page, limit);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new movie' })
    @ApiResponse({ status: 201, type: MovieResponseDto })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    createMovie(@Body() dto: CreateMovieDto) {
        return this.moviesService.create(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get movie by ID' })
    @ApiParam({ name: 'id', description: 'Movie ID', example: '507f1f77bcf86cd799439011' })
    @ApiResponse({ status: 200, type: MovieResponseDto })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    getMovie(@Param('id') id: string) {
        return this.moviesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a movie' })
    @ApiParam({ name: 'id', description: 'Movie ID', example: '507f1f77bcf86cd799439011' })
    @ApiResponse({ status: 200, type: MovieResponseDto })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    updateMovie(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
        return this.moviesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a movie' })
    @ApiParam({ name: 'id', description: 'Movie ID', example: '507f1f77bcf86cd799439011' })
    @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    deleteMovie(@Param('id') id: string) {
        return this.moviesService.deleteOne(id);
    }
}
