import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@SkipThrottle()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHealth() {
    return this.appService.getLiveness();
  }

  @Public()
  @Get('health')
  health() {
    return this.appService.getLiveness();
  }

  @Public()
  @Get('health/ready')
  ready() {
    const health = this.appService.getReadiness();
    if (health.status !== 'ok') {
      throw new ServiceUnavailableException(health);
    }
    return health;
  }
}
