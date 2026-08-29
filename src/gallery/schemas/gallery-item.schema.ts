import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GalleryItemDocument = HydratedDocument<GalleryItem>;

export const GALLERY_SECTIONS = [
  'hero',
  'about',
  'vehicle',
  'partners',
  'contact',
] as const;

export type GallerySection = (typeof GALLERY_SECTIONS)[number];

@Schema({ timestamps: true, collection: 'gallery_items' })
export class GalleryItem {
  @Prop({ required: true, trim: true })
  imageUrl: string;

  @Prop({ trim: true, default: '' })
  title: string;

  @Prop({ trim: true, default: '' })
  alt: string;

  /** Section accueil liée à cette image */
  @Prop({
    trim: true,
    default: 'partners',
    enum: [...GALLERY_SECTIONS],
  })
  section: GallerySection;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);
GalleryItemSchema.index({ sortOrder: 1 });
GalleryItemSchema.index({ section: 1, sortOrder: 1 });
