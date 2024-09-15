import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InsumosModule } from './insumos/insumos.module';
import { LotesModule } from './lotes/lotes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { InsumoDepartamentoModule } from './insumo_departamentos/insumo_departamentos.module';
import * as Joi from 'joi';
import Departamento from './departamentos/entities/departamento.entity';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { DepartamentosModule } from './departamentos/departamentos.module';

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
      synchronize: true,
    }),
    InsumosModule,
    LotesModule,
    CategoriasModule,
    InsumoDepartamentoModule,
   // UsersController,
    //AuthModule,
    DepartamentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
