import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import {
  CreateGalleryItemDto,
  ReorderGalleryDto,
  UpdateGalleryItemDto,
} from './dto/gallery.dto';
import {
  createImageStorage,
  imageFileFilter,
  MAX_IMAGE_SIZE,
} from '../common/upload.utils';
import { Public } from '../common/decorators/public.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Public()
  @Get('public')
  findPublic() {
    return this.galleryService.findPublic();
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.galleryService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createImageStorage('gallery'),
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_IMAGE_SIZE },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateGalleryItemDto,
  ) {
    return this.galleryService.create(file, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGalleryItemDto) {
    return this.galleryService.update(id, dto);
  }

  @Patch(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createImageStorage('gallery'),
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_IMAGE_SIZE },
    }),
  )
  replaceImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.replaceImage(id, file);
  }

  @Put('reorder')
  reorder(@Body() body: ReorderGalleryDto) {
    return this.galleryService.reorder(body.ids ?? []);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
