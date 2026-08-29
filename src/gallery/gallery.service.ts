import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GalleryItem,
  GalleryItemDocument,
} from './schemas/gallery-item.schema';
import {
  CreateGalleryItemDto,
  UpdateGalleryItemDto,
} from './dto/gallery.dto';
import { deleteUploadFile, toPublicUploadPath } from '../common/upload.utils';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(GalleryItem.name)
    private readonly galleryModel: Model<GalleryItemDocument>,
  ) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const filter: Record<string, unknown> = {};

    if (params.search?.trim()) {
      const q = params.search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { alt: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.galleryModel
        .find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.galleryModel.countDocuments(filter),
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
    return this.galleryModel
      .find({ isActive: true })
      .select('imageUrl section sortOrder isActive')
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async create(
    file: Express.Multer.File | undefined,
    dto: CreateGalleryItemDto,
  ) {
    if (!file) {
      throw new BadRequestException('Une image est requise');
    }

    const maxOrder = await this.galleryModel
      .findOne()
      .sort({ sortOrder: -1 })
      .select('sortOrder')
      .lean();

    return this.galleryModel.create({
      imageUrl: toPublicUploadPath(file.filename, 'gallery'),
      title: dto.title ?? '',
      alt: dto.alt ?? dto.title ?? '',
      section: dto.section ?? 'partners',
      sortOrder: dto.sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1,
      isActive: dto.isActive ?? true,
    });
  }

  async update(id: string, dto: UpdateGalleryItemDto) {
    const updated = await this.galleryModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Image introuvable');
    }
    return updated;
  }

  async replaceImage(id: string, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Une image est requise');
    }
    const item = await this.galleryModel.findById(id);
    if (!item) {
      throw new NotFoundException('Image introuvable');
    }
    deleteUploadFile(item.imageUrl);
    item.imageUrl = toPublicUploadPath(file.filename, 'gallery');
    await item.save();
    return item.toObject();
  }

  async reorder(ids: string[]) {
    const ops = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index + 1 } },
      },
    }));
    if (ops.length) {
      await this.galleryModel.bulkWrite(ops);
    }
    return this.findAll({ page: 1, limit: 100 });
  }

  async remove(id: string) {
    const item = await this.galleryModel.findByIdAndDelete(id).exec();
    if (!item) {
      throw new NotFoundException('Image introuvable');
    }
    deleteUploadFile(item.imageUrl);
    return { deleted: true, id };
  }
}
