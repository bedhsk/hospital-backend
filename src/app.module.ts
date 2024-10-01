import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { Module } from '@nestjs/common';
import { PacientesModule } from './pacientes/pacientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { LotesModule } from './lotes/lotes.module';
import * as Joi from 'joi';
import { InsumoDepartamentosModule } from './insumo_departamentos/insumo_departamentos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { InsumosModule } from './insumos/insumos.module';
import { RetirosModule } from './retiros/retiros.module';

import { AdquisicionesModule } from './adquisiciones/adquisiciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    PacientesModule,
    InsumosModule,
    CategoriasModule,
    InsumoDepartamentosModule,
    DepartamentosModule,
    LotesModule,
    InsumoDepartamentosModule,
    RetirosModule,
    AdquisicionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
