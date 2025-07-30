import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto } from './dto';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService:MoviesService){}

@Get()
getAll(@Query('page') page: number, @Query('limit') limit: number) {
  return this.moviesService.findAll(page, limit);
}

@Post()
createMovie(@Body() dto: CreateMovieDto) {
  return this.moviesService.create(dto);
}

@Patch(':id')
updateMovie(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
  return this.moviesService.update(id, dto);
}

}
