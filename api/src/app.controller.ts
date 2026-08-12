import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health-startup')
  getHealthStartup(): string {
    return this.appService.getHealthStartup();
  }

  @Get('/health-readiness')
  getHealthReadiness(): string {
    return this.appService.getHealthReadiness();
  }

  @Get('/health-liveness')
  getHealthLiveness(): string {
    return this.appService.getHealthLiveness();
  }
}
