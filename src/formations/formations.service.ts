import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Formation, FormationDocument } from './schemas/formation.schema';
import {
  CreateFormationDto,
  UpdateFormationDto,
} from './dto/create-formation.dto';
import { SEED_FORMATIONS } from './seed-formations';
import {
  deleteUploadFile,
  toPublicUploadPath,
} from '../common/upload.utils';

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizePackages(
  packages: CreateFormationDto['packages'] = [],
) {
  return (packages ?? []).map((pkg) => ({
    title: pkg.title.trim(),
    theme: pkg.theme || 'yellow',
    icon: pkg.icon?.trim() || '',
    imageUrl: pkg.imageUrl?.trim() || '',
    minAgeLabel: pkg.minAgeLabel?.trim() || '',
    packageHeadline: pkg.packageHeadline?.trim() || '',
    features: (pkg.features ?? [])
      .filter((f) => f.text?.trim())
      .map((f) => ({
        text: f.text.trim(),
        icon: f.icon?.trim() || 'Check',
      })),
    price: Number(pkg.price) || 0,
    extraHourPrice: pkg.extraHourPrice,
    extraHourLabel: pkg.extraHourLabel?.trim() || '',
    ctaLabel: pkg.ctaLabel?.trim() || 'Contactez-nous',
  }));
}

function inferDetailLayout(dto: {
  detailLayout?: 'formulas' | 'packages' | 'content';
  packages?: CreateFormationDto['packages'];
  contentFeatures?: CreateFormationDto['contentFeatures'];
}) {
  if (dto.detailLayout) return dto.detailLayout;
  if ((dto.packages?.length ?? 0) > 0) {
    const hasHeadline = (dto.packages ?? []).some((p) =>
      Boolean(p.packageHeadline?.trim()),
    );
    return hasHeadline ? 'packages' : 'formulas';
  }
  if ((dto.contentFeatures?.length ?? 0) > 0) return 'content';
  return 'formulas';
}

@Injectable()
export class FormationsService implements OnModuleInit {
  constructor(
    @InjectModel(Formation.name)
    private readonly formationModel: Model<FormationDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.formationModel.countDocuments();
    if (count > 0) return;
    if (process.env.NODE_ENV === 'production' && process.env.SEED_DATA !== 'true') {
      return;
    }

    for (const item of SEED_FORMATIONS) {
      await this.formationModel.create({
        ...item,
        slug: slugify(item.slug || item.title),
        isActive: item.isActive ?? true,
        isComingSoon: item.isComingSoon ?? false,
        packages: item.packages ?? [],
        contentFeatures: item.contentFeatures ?? [],
      });
    }
  }

  async create(dto: CreateFormationDto) {
    const slug = slugify(dto.slug || dto.title);
    const exists = await this.formationModel.exists({ slug });
    if (exists) {
      throw new ConflictException(
        `Une formation avec le slug "${slug}" existe déjà`,
      );
    }

    const maxOrder = await this.formationModel
      .findOne()
      .sort({ sortOrder: -1 })
      .select('sortOrder')
      .lean();

    return this.formationModel.create({
      ...dto,
      slug,
      sortOrder: dto.sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1,
      isActive: dto.isActive ?? true,
      isComingSoon: dto.isComingSoon ?? false,
      isOnPromotion: dto.isOnPromotion ?? false,
      packages: normalizePackages(dto.packages),
      contentFeatures: (dto.contentFeatures ?? [])
        .filter((f) => f.text?.trim())
        .map((f) => ({
          text: f.text.trim(),
          icon: f.icon?.trim() || 'Check',
        })),
      detailLayout: inferDetailLayout(dto),
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    activeOnly?: boolean;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const filter: Record<string, unknown> = {};

    if (params.activeOnly) {
      filter.isActive = true;
    }

    if (params.search?.trim()) {
      const q = params.search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { subtitle: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.formationModel
        .find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.formationModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findPublic() {
    return this.formationModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const formation = await this.formationModel.findById(id).lean().exec();
    if (!formation) {
      throw new NotFoundException('Formation introuvable');
    }
    return formation;
  }

  async findBySlug(slug: string) {
    const formation = await this.formationModel
      .findOne({ slug, isActive: true })
      .lean()
      .exec();
    if (!formation) {
      throw new NotFoundException('Formation introuvable');
    }
    return formation;
  }

  async update(id: string, dto: UpdateFormationDto) {
    if (dto.slug !== undefined && dto.slug.trim()) {
      const slug = slugify(dto.slug);
      const conflict = await this.formationModel.exists({
        slug,
        _id: { $ne: id },
      });
      if (conflict) {
        throw new ConflictException(
          `Une formation avec le slug "${slug}" existe déjà`,
        );
      }
      dto.slug = slug;
    } else {
      delete dto.slug;
    }

    const patch: Record<string, unknown> = { ...dto };
    if (dto.packages !== undefined) {
      patch.packages = normalizePackages(dto.packages);
      patch.detailLayout = inferDetailLayout({
        detailLayout: dto.detailLayout,
        packages: dto.packages,
        contentFeatures: dto.contentFeatures,
      });
    }
    if (dto.contentFeatures !== undefined) {
      patch.contentFeatures = (dto.contentFeatures ?? [])
        .filter((f) => f.text?.trim())
        .map((f) => ({
          text: f.text.trim(),
          icon: f.icon?.trim() || 'Check',
        }));
      if (dto.packages === undefined) {
        const current = await this.formationModel.findById(id).lean();
        patch.detailLayout = inferDetailLayout({
          detailLayout: dto.detailLayout,
          packages: current?.packages as CreateFormationDto['packages'],
          contentFeatures: dto.contentFeatures,
        });
      }
    }

    const unset: Record<string, 1> = {};
    if (dto.isOnPromotion === false) {
      patch.isOnPromotion = false;
      unset.oldPrice = 1;
      delete patch.oldPrice;
    }

    const updated = await this.formationModel
      .findByIdAndUpdate(
        id,
        {
          $set: patch,
          ...(Object.keys(unset).length ? { $unset: unset } : {}),
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Formation introuvable');
    }
    return updated;
  }

  async setImage(id: string, filename: string) {
    const formation = await this.formationModel.findById(id);
    if (!formation) {
      throw new NotFoundException('Formation introuvable');
    }
    deleteUploadFile(formation.detailImageUrl);
    formation.detailImageUrl = toPublicUploadPath(filename, 'formations');
    await formation.save();
    return formation.toObject();
  }

  async toggleActive(id: string) {
    const formation = await this.formationModel.findById(id);
    if (!formation) {
      throw new NotFoundException('Formation introuvable');
    }
    formation.isActive = !formation.isActive;
    await formation.save();
    return formation.toObject();
  }

  async reorder(orderedIds: string[]) {
    const ops = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index + 1 } },
      },
    }));
    if (ops.length) {
      await this.formationModel.bulkWrite(ops);
    }
    return this.findAll({ page: 1, limit: 100 });
  }

  async remove(id: string) {
    const deleted = await this.formationModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Formation introuvable');
    }
    deleteUploadFile(deleted.detailImageUrl);
    return { deleted: true, id };
  }
}
