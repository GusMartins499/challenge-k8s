import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { Env } from '../config/env';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;

  readonly db: Database;

  constructor(private readonly config: ConfigService<Env, true>) {
    this.pool = new Pool({
      host: this.config.get('POSTGRES_HOST', { infer: true }),
      port: this.config.get('POSTGRES_PORT', { infer: true }),
      user: this.config.get('POSTGRES_USER', { infer: true }),
      password: this.config.get('POSTGRES_PASSWORD', { infer: true }),
      database: this.config.get('POSTGRES_DB', { infer: true }),
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.ping();
      this.logger.log('Conexão com o banco estabelecida');

      await migrate(this.db, { migrationsFolder: 'drizzle' });
      this.logger.log('Migrations aplicadas');
    } catch (error) {
      this.logger.error('Falha ao inicializar o banco', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
    this.logger.log('Conexão com o banco encerrada');
  }

  async ping(): Promise<void> {
    await this.db.execute(sql`select 1`);
  }
}
