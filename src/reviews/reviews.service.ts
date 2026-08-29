import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async findPublic() {
    return this.reviewModel
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .select('authorName rating comment createdAt')
      .lean()
      .exec();
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const filter: Record<string, unknown> = {};

    if (params.search?.trim()) {
      const q = params.search.trim();
      filter.$or = [
        { authorName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { comment: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.reviewModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(dto: CreateReviewDto) {
    return this.reviewModel.create({
      authorName: dto.authorName,
      email: dto.email,
      phone: dto.phone ?? '',
      rating: dto.rating ?? 5,
      comment: dto.comment,
      isPublished: false,
    });
  }

  async update(id: string, dto: UpdateReviewDto) {
    const updated = await this.reviewModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Avis introuvable');
    }
    return updated;
  }

  async togglePublished(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }
    review.isPublished = !review.isPublished;
    await review.save();
    return review.toObject();
  }

  async remove(id: string) {
    const item = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!item) {
      throw new NotFoundException('Avis introuvable');
    }
    return { deleted: true, id };
  }
}
