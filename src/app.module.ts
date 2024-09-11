import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MedicamentosModule } from './medicamentos/medicamentos.module';
import { IndiceMedicamentosModule } from './indice_medicamentos/indice_medicamentos.module';
import { InsumosModule } from './insumos/insumos.module';
import { IndiceInsumosModule } from './indice_insumos/indice_insumos.module';
import { LotesModule } from './lotes/lotes.module';
import { MovimientoInsumosModule } from './movimiento_insumos/movimiento_insumos.module';
import { CategoriasModule } from './categorias/categorias.module';
import * as Joi from 'joi';

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
    MedicamentosModule,
    IndiceMedicamentosModule,
    InsumosModule,
    IndiceInsumosModule,
    LotesModule,
    MovimientoInsumosModule,
    CategoriasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
