import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import IndiceInsumo from './entities/indice_insumo.entity';
import { IndiceInsumosController } from './indice_insumos.controller';
import { IndiceInsumosService } from './indice_insumos.service';
import { InsumosModule } from 'src/insumos/insumos.module';

@Module({
  imports: [TypeOrmModule.forFeature([IndiceInsumo]),
  InsumosModule,
  ],
  providers: [IndiceInsumosService],
  controllers: [IndiceInsumosController],
  exports: [IndiceInsumosService],
})
export class IndiceInsumosModule {}
