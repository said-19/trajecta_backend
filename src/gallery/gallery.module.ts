import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryItem, GalleryItemSchema } from './schemas/gallery-item.schema';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GalleryItem.name, schema: GalleryItemSchema },
    ]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
