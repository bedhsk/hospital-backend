import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import Adquisicion from './adquisicion.entity';

@Entity('detalleAdquisicion')
export default class detalleAdquisicion {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean; // Soft delete

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsNumber()
  cantidad: number; // Soft delete

  @ManyToOne(() => Adquisicion, (adquisicion) => adquisicion.detalleAdquisicion)
  @JoinColumn({ name: 'adquisicionId' })
  adquisicion: Adquisicion; // Relación con adquisicion

  @ManyToOne(() => InsumoDepartamento, (insumoDepartamento) => insumoDepartamento.detalleAdquisicion)
  @JoinColumn({ name: 'insumoDepartamentoId' })
  insumoDepartamento: Adquisicion; // Relación con insumoDepartamento

}
