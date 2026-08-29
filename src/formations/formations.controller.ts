import {
  BadRequestException,
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
import { FormationsService } from './formations.service';
import {
  CreateFormationDto,
  UpdateFormationDto,
} from './dto/create-formation.dto';
import { ReorderFormationsDto } from './dto/reorder-formations.dto';
import {
  createImageStorage,
  imageFileFilter,
  MAX_IMAGE_SIZE,
} from '../common/upload.utils';
import { Public } from '../common/decorators/public.decorator';

@Controller('formations')
export class FormationsController {
  constructor(private readonly formationsService: FormationsService) {}

  @Public()
  @Get('public')
  findPublic() {
    return this.formationsService.findPublic();
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.formationsService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
      activeOnly: activeOnly === 'true',
    });
  }

  @Put('reorder')
  reorder(@Body() body: ReorderFormationsDto) {
    return this.formationsService.reorder(body.ids ?? []);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.formationsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formationsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFormationDto) {
    return this.formationsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFormationDto) {
    return this.formationsService.update(id, dto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.formationsService.toggleActive(id);
  }

  @Patch(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createImageStorage('formations'),
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_IMAGE_SIZE },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Une image est requise');
    }
    return this.formationsService.setImage(id, file.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formationsService.remove(id);
  }
}
