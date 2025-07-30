import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMovieDto,UpdateMovieDto} from './dto'
import { Movie, MovieDocument, MovieResponse } from '../common/schema/movie.schema';

export interface PaginatedResult<T> {
  results: T[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async findAll(page = 1, limit = 10): Promise<PaginatedResult<Movie>> {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.movieModel.find().skip(skip).limit(limit).exec(),
      this.movieModel.countDocuments(),
    ]);

    return {
      results,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async create(createMovieDto: CreateMovieDto): Promise<MovieResponse> {
    const movie = new this.movieModel(createMovieDto);
    return movie.save();
  }
  
  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<MovieResponse> {
    const updated = await this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true });
    if (!updated) {
      throw new NotFoundException('Movie not found');
    }
    return updated;
  }
}
