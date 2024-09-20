import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import Role from 'src/users/entities/role.entity';
import User from 'src/users/entities/user.entity';

// Cargar las variables de entorno desde el archivo .env.local
dotenv.config({ path: '.env.local' });

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [Role, User],
  migrations: ['./src/migrations/*.ts'],
});
