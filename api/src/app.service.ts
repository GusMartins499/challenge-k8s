import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHealthStartup(): string {
    return 'Health startup probe!';
  }
  getHealthReadiness(): string {
    return 'Health readiness probe!';
  }
  getHealthLiveness(): string {
    return 'Health liveness probe!';
  }
}
