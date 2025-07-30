import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'
import { MoviesModule } from './movies/movies.module';
import { S3Module } from './s3/s3.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { RateLimitMiddleware } from './rate-limiter/rate-limit.middleware';


@Module({
  imports: [
    AuthModule,
    MoviesModule,
    S3Module,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI', { infer: true }),
      }),
    }),
    CommonModule,
    UserModule,
    RateLimiterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');
  }
}
