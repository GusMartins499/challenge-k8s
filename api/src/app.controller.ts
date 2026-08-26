import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DataRecord } from './db/schema';

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

  @Get('/status')
  async getStatus(): Promise<string> {
    return await this.appService.getStatus();
  }

  @Get('/dados')
  async listData(): Promise<DataRecord[]> {
    return await this.appService.listData();
  }

  @Post('/dados')
  async createData(): Promise<DataRecord> {
    return await this.appService.createData();
  }
}
