import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const connectionSource = new DataSource({
  type: 'postgres',
  entities: ['apps/api/src/app/**/*.entity{.ts,.js}'],
  migrations: ['apps/api/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrationTable',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT as string),
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
