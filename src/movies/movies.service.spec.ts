import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Movie } from '../common/schema/movie.schema';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockMovieModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    // Add other methods your controller uses
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: getModelToken(Movie.name),
          useValue: mockMovieModel,
        },
        MoviesService
        // Add any other services your controller depends on
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});