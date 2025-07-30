import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  publishingYear: number;

  @Prop({ required: true })
  posterUrl: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

export type MovieResponse = MovieDocument

