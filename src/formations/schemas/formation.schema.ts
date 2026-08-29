import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FormationFeatureDocument = HydratedDocument<FormationFeature>;
export type FormationPackageDocument = HydratedDocument<FormationPackage>;
export type FormationDocument = HydratedDocument<Formation>;

export type FormationTheme = 'yellow' | 'blue' | 'navy';
export type FormationDetailLayout = 'formulas' | 'packages' | 'content';

@Schema({ _id: false })
export class FormationFeature {
  @Prop({ trim: true, default: 'Check' })
  icon: string;

  @Prop({ required: true, trim: true })
  text: string;
}

export const FormationFeatureSchema =
  SchemaFactory.createForClass(FormationFeature);

@Schema({ _id: false })
export class FormationPackage {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true, default: 'yellow', enum: ['yellow', 'blue', 'navy'] })
  theme: FormationTheme;

  @Prop({ trim: true, default: '' })
  icon: string;

  @Prop({ trim: true, default: '' })
  imageUrl: string;

  @Prop({ trim: true, default: '' })
  minAgeLabel: string;

  @Prop({ trim: true, default: '' })
  packageHeadline: string;

  @Prop({ type: [FormationFeatureSchema], default: [] })
  features: FormationFeature[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  extraHourPrice?: number;

  @Prop({ trim: true, default: '' })
  extraHourLabel: string;

  @Prop({ trim: true, default: 'Contactez-nous' })
  ctaLabel: string;
}

export const FormationPackageSchema =
  SchemaFactory.createForClass(FormationPackage);

@Schema({ timestamps: true, collection: 'formations' })
export class Formation {
  @Prop({ required: true, trim: true })
  title: string;

  /** Auto-generated from title */
  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({ required: true, trim: true })
  subtitle: string;

  @Prop({ trim: true, default: 'GraduationCap' })
  icon: string;

  /** Prix affiché (nouveau prix si promo) */
  @Prop({ min: 0, default: 0 })
  startingPrice: number;

  @Prop({ default: false })
  isOnPromotion: boolean;

  /** Ancien prix barré (si promo) */
  @Prop({ min: 0 })
  oldPrice?: number;

  @Prop({ default: false })
  isComingSoon: boolean;

  /** Auto: formulas | packages | content */
  @Prop({
    default: 'formulas',
    enum: ['formulas', 'packages', 'content'],
  })
  detailLayout: FormationDetailLayout;

  @Prop({ trim: true, default: '' })
  detailSubtitle: string;

  @Prop({ trim: true, default: '' })
  detailImageUrl: string;

  @Prop({ type: [FormationFeatureSchema], default: [] })
  contentFeatures: FormationFeature[];

  @Prop({ type: [FormationPackageSchema], default: [] })
  packages: FormationPackage[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const FormationSchema = SchemaFactory.createForClass(Formation);
FormationSchema.index({ sortOrder: 1, createdAt: -1 });
