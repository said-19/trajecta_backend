import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  SiteSettingsService,
  type SiteSettingsView,
} from './site-settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Public()
  @Get('public')
  getPublic(): Promise<SiteSettingsView> {
    return this.siteSettingsService.get();
  }

  @Get()
  get(): Promise<SiteSettingsView> {
    return this.siteSettingsService.get();
  }

  @Put()
  update(@Body() dto: UpdateSiteSettingsDto): Promise<SiteSettingsView> {
    return this.siteSettingsService.update(dto);
  }
}
