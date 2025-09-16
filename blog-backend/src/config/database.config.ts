import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGO_URI || 'mongodb://localhost/BlogDB',
  database: 'BlogDB',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
