import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ required: true, trim: true })
  authorName: string;

  @Prop({ trim: true, lowercase: true, default: '' })
  email: string;

  @Prop({ trim: true, default: '' })
  phone: string;

  @Prop({ required: true, min: 1, max: 5, default: 5 })
  rating: number;

  @Prop({ required: true, trim: true })
  comment: string;

  @Prop({ default: false })
  isPublished: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ isPublished: 1, createdAt: -1 });
