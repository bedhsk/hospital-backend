import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  JoinColumn,
} from 'typeorm';
import Lote from './lote.entity';
import detalleAdquisicion from 'src/adquisiciones/entities/detalle_adquisicion.entity';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';

@Entity('movimientoLote')
export default class movimientoLote {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'int' })
  @ApiProperty()
  @IsNumber()
  cantidad: number;

  @ManyToOne(
    () => Lote,
    (lote) => lote.movimientoLote,
  )
  @JoinColumn({ name: 'loteId' })
  lote: Lote; // Relación con Lote

  @ManyToOne(
    () => detalleAdquisicion,
    (detalleAdquisicion) => detalleAdquisicion.movimientoLote,
  )
  @JoinColumn({ name: 'detalleAdquisicionId' })
  detalleAdquisicion: Lote; // Relación con DetalleAdquisicion

  @ManyToOne(
    () => DetalleRetiro,
    (detalleRetiro) => detalleRetiro.movimientoLote,
  )
  @JoinColumn({ name: 'detalleRetiroId' })
  detalleRetiro: Lote; // Relación con detalleRetiro
}
