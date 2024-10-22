import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import movimientoLote from './movimiento-lote.entity';

@Entity('lote')
export default class Lote {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string; // UUID

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  @IsString()
  numeroLote: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  @ApiProperty()
  @IsDate()
  created_at: Date;

  @Column({ type: 'date' })
  @ApiProperty()
  @IsDate()
  fechaCaducidad: Date;

  @Column({ type: 'int', default: 0 })
  @ApiProperty()
  @IsNumber()
  cantidadInical: number;

  @Column({ type: 'int' })
  @ApiProperty()
  @IsNumber()
  cantidadActual?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty()
  @IsString()
  status: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean = true; // Soft delete

  @ManyToOne(
    () => InsumoDepartamento,
    (insumoDepartamento) => insumoDepartamento.lotes,
  )
  @JoinColumn({ name: 'insumoDepartamentoId' })
  insumoDepartamento: InsumoDepartamento; // Relación con InsumoDepartamento

  @OneToMany(
    () => movimientoLote,
    (movimientoLote) => movimientoLote.lote,
  )
  movimientoLote: movimientoLote[];
}
