import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MoviesModule } from './movies.module';
import { MoviesController } from './movies.controller';

describe('MoviesController', () => {
  let controller: MoviesController;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MoviesModule,
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});