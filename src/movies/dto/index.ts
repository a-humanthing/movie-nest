import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMovieDto {
    @IsString()
    title: string;
  
    @IsNumber()
    publishingYear: number;
  
    @IsString()
    posterUrl: string;
  }
  
  export class UpdateMovieDto {
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsNumber()
    publishingYear?: number;
  
    @IsOptional()
    @IsString()
    posterUrl?: string;
  }
