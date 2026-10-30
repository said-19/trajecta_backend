import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OpeningHour,
  SiteSettings,
  SiteSettingsDocument,
} from './schemas/site-settings.schema';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

export type SiteSettingsView = {
  _id: string;
  phone: string;
  address: string;
  googleMapsUrl: string;
  email: string;
  tiktokUrl: string;
  instagramUrl: string;
  whatsappPhone: string;
  hours: OpeningHour[];
  lessonHours: OpeningHour[];
  statClients: number;
  statYears: number;
  statHours: number;
  statInstructors: number;
  marketYears: number;
  instructorCount: number;
  successRate: number;
  heroText: string;
  aboutText1: string;
  aboutText2: string;
  vehicleModel: string;
  vehicleFeatures: string[];
  questionText: string;
};

const DEFAULT_HOURS: OpeningHour[] = [
  { day: 'Lundi', openTime: '09:00', closeTime: '19:00', isClosed: false },
  { day: 'Mardi', openTime: '09:00', closeTime: '19:00', isClosed: false },
  { day: 'Mercredi', openTime: '09:00', closeTime: '19:00', isClosed: false },
  { day: 'Jeudi', openTime: '09:00', closeTime: '19:00', isClosed: false },
  { day: 'Vendredi', openTime: '09:00', closeTime: '19:00', isClosed: false },
  { day: 'Samedi', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { day: 'Dimanche', openTime: '', closeTime: '', isClosed: true },
];

const DEFAULT_LESSON_HOURS: OpeningHour[] = [
  { day: 'Lundi', openTime: '08:00', closeTime: '20:00', isClosed: false },
  { day: 'Mardi', openTime: '08:00', closeTime: '20:00', isClosed: false },
  { day: 'Mercredi', openTime: '08:00', closeTime: '20:00', isClosed: false },
  { day: 'Jeudi', openTime: '08:00', closeTime: '20:00', isClosed: false },
  { day: 'Vendredi', openTime: '08:00', closeTime: '20:00', isClosed: false },
  { day: 'Samedi', openTime: '08:00', closeTime: '18:00', isClosed: false },
  { day: 'Dimanche', openTime: '', closeTime: '', isClosed: true },
];

const DEFAULT_SETTINGS = {
  phone: '06 50 18 06 97',
  address: '18 Rue des Dauphins, 69003 Lyon 3',
  googleMapsUrl: '',
  email: 'contact@trajecta-conduite.fr',
  tiktokUrl: '',
  instagramUrl: '',
  whatsappPhone: '06 50 18 06 97',
  hours: DEFAULT_HOURS,
  lessonHours: DEFAULT_LESSON_HOURS,
  statClients: 1250,
  statYears: 8,
  statHours: 18400,
  statInstructors: 12,
  marketYears: 1,
  instructorCount: 4,
  successRate: 95,
  heroText:
    'Un accompagnement personnalisé pour réussir votre permis dans les meilleures conditions.',
  aboutText1:
    'Chez Trajecta, chaque élève est accompagné avec sérieux, pédagogie et bienveillance.',
  aboutText2:
    "Notre objectif est de former des conducteurs responsables tout en offrant une expérience d'apprentissage moderne et rassurante.",
  vehicleModel: 'Citroën C4',
  vehicleFeatures: [
    'Double commande',
    'Équipements modernes',
    'Climatisation',
    'Confort optimal',
    "Technologies d'aide à la conduite",
    'Assistance personnalisée',
  ],
  questionText:
    'Vous avez une question sur le contenu de nos formations, sur nos tarifs ou sur nos horaires ? Besoin de conseils personnalisés en fonction de votre situation ? Vous avez des contraintes d’agenda ou souhaitez passer le permis rapidement ?',
};

@Injectable()
export class SiteSettingsService implements OnModuleInit {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly settingsModel: Model<SiteSettingsDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.settingsModel.countDocuments();
    if (count === 0) {
      await this.settingsModel.create(DEFAULT_SETTINGS);
    }
  }

  private toView(settings: {
    _id?: unknown;
    phone?: string;
    address?: string;
    googleMapsUrl?: string;
    email?: string;
    tiktokUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappPhone?: string;
    hours?: OpeningHour[];
    lessonHours?: OpeningHour[];
    statClients?: number;
    statYears?: number;
    statHours?: number;
    statInstructors?: number;
    marketYears?: number;
    instructorCount?: number;
    successRate?: number;
    heroText?: string;
    aboutText1?: string;
    aboutText2?: string;
    vehicleModel?: string;
    vehicleFeatures?: string[];
    questionText?: string;
  }): SiteSettingsView {
    const text = (value: string | undefined, fallback: string) =>
      value?.trim() ? value.trim() : fallback;
    const features = (settings.vehicleFeatures ?? [])
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      _id: String(settings._id ?? ''),
      phone: settings.phone ?? DEFAULT_SETTINGS.phone,
      address: settings.address ?? DEFAULT_SETTINGS.address,
      googleMapsUrl: settings.googleMapsUrl?.trim() ?? '',
      email: settings.email ?? DEFAULT_SETTINGS.email,
      tiktokUrl:
        settings.tiktokUrl != null
          ? settings.tiktokUrl
          : (settings.facebookUrl ?? ''),
      instagramUrl: settings.instagramUrl ?? '',
      whatsappPhone: settings.whatsappPhone ?? DEFAULT_SETTINGS.whatsappPhone,
      hours: settings.hours?.length ? settings.hours : DEFAULT_HOURS,
      lessonHours: settings.lessonHours?.length
        ? settings.lessonHours
        : DEFAULT_LESSON_HOURS,
      statClients: settings.statClients ?? DEFAULT_SETTINGS.statClients,
      statYears: settings.statYears ?? DEFAULT_SETTINGS.statYears,
      statHours: settings.statHours ?? DEFAULT_SETTINGS.statHours,
      statInstructors:
        settings.statInstructors ?? DEFAULT_SETTINGS.statInstructors,
      marketYears: settings.marketYears ?? DEFAULT_SETTINGS.marketYears,
      instructorCount:
        settings.instructorCount ?? DEFAULT_SETTINGS.instructorCount,
      successRate: settings.successRate ?? DEFAULT_SETTINGS.successRate,
      heroText: text(settings.heroText, DEFAULT_SETTINGS.heroText),
      aboutText1: text(settings.aboutText1, DEFAULT_SETTINGS.aboutText1),
      aboutText2: text(settings.aboutText2, DEFAULT_SETTINGS.aboutText2),
      vehicleModel: text(settings.vehicleModel, DEFAULT_SETTINGS.vehicleModel),
      vehicleFeatures: features.length
        ? features
        : DEFAULT_SETTINGS.vehicleFeatures,
      questionText: text(settings.questionText, DEFAULT_SETTINGS.questionText),
    };
  }

  async get(): Promise<SiteSettingsView> {
    let settings = await this.settingsModel.findOne().lean().exec();
    if (!settings) {
      await this.settingsModel.create(DEFAULT_SETTINGS);
      settings = await this.settingsModel.findOne().lean().exec();
    }
    if (!settings) {
      throw new Error('Impossible de charger les paramètres du site');
    }
    return this.toView(settings);
  }

  async update(dto: UpdateSiteSettingsDto): Promise<SiteSettingsView> {
    const current = await this.get();
    const updated = await this.settingsModel
      .findByIdAndUpdate(current._id, { $set: dto }, { new: true })
      .lean()
      .exec();
    return updated ? this.toView(updated) : this.get();
  }
}
