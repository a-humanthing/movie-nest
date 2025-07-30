import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'
import { MoviesModule } from './movies/movies.module';
import { S3Module } from './s3/s3.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';


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

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
