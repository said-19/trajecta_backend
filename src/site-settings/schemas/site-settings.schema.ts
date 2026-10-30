import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OpeningHourDocument = HydratedDocument<OpeningHour>;

@Schema({ _id: false })
export class OpeningHour {
  @Prop({ required: true, trim: true })
  day: string;

  @Prop({ trim: true, default: '' })
  openTime: string;

  @Prop({ trim: true, default: '' })
  closeTime: string;

  @Prop({ default: false })
  isClosed: boolean;
}

export const OpeningHourSchema = SchemaFactory.createForClass(OpeningHour);

export type SiteSettingsDocument = HydratedDocument<SiteSettings>;

@Schema({ timestamps: true, collection: 'site_settings' })
export class SiteSettings {
  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ trim: true, default: '' })
  googleMapsUrl: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true, default: '' })
  tiktokUrl: string;

  @Prop({ trim: true, default: '' })
  facebookUrl: string;

  @Prop({ trim: true, default: '' })
  instagramUrl: string;

  @Prop({ trim: true, default: '' })
  whatsappPhone: string;

  @Prop({ type: [OpeningHourSchema], default: [] })
  hours: OpeningHour[];

  @Prop({ type: [OpeningHourSchema], default: [] })
  lessonHours: OpeningHour[];

  @Prop({ default: 1250 })
  statClients: number;

  @Prop({ default: 8 })
  statYears: number;

  @Prop({ default: 18400 })
  statHours: number;

  @Prop({ default: 12 })
  statInstructors: number;

  @Prop({ default: 1 })
  marketYears: number;

  @Prop({ default: 4 })
  instructorCount: number;

  @Prop({ default: 95 })
  successRate: number;

  @Prop({
    trim: true,
    default:
      'Un accompagnement personnalisé pour réussir votre permis dans les meilleures conditions.',
  })
  heroText: string;

  @Prop({
    trim: true,
    default:
      'Chez Trajecta, chaque élève est accompagné avec sérieux, pédagogie et bienveillance.',
  })
  aboutText1: string;

  @Prop({
    trim: true,
    default:
      "Notre objectif est de former des conducteurs responsables tout en offrant une expérience d'apprentissage moderne et rassurante.",
  })
  aboutText2: string;

  @Prop({ trim: true, default: 'Citroën C4' })
  vehicleModel: string;

  @Prop({
    type: [String],
    default: [
      'Double commande',
      'Équipements modernes',
      'Climatisation',
      'Confort optimal',
      "Technologies d'aide à la conduite",
      'Assistance personnalisée',
    ],
  })
  vehicleFeatures: string[];

  @Prop({
    trim: true,
    default:
      'Vous avez une question sur le contenu de nos formations, sur nos tarifs ou sur nos horaires ? Besoin de conseils personnalisés en fonction de votre situation ? Vous avez des contraintes d’agenda ou souhaitez passer le permis rapidement ?',
  })
  questionText: string;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
