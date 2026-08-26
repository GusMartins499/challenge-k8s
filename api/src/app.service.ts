import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from './db/database.service';
import { DataRecord, dados } from './db/schema';

@Injectable()
export class AppService {
  constructor(private readonly database: DatabaseService) {}

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

  async getStatus(): Promise<string> {
    await this.database.ping();
    return 'Conexão OK';
  }

  async listData(): Promise<DataRecord[]> {
    return await this.database.db.select().from(dados).orderBy(dados.id);
  }

  async createData(): Promise<DataRecord> {
    const name = `registro-${randomUUID().slice(0, 8)}`;

    const [record] = await this.database.db
      .insert(dados)
      .values({ name })
      .returning();

    return record;
  }
}
