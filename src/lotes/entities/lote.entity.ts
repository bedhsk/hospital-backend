import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  JoinColumn,
} from 'typeorm';

@Entity('lote')
export default class Lote {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string; // UUID

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  @IsString()
  numeroLote: string;

  @Column({ type: 'date' })
  @ApiProperty()
  @IsDate()
  fechaFabricacion: Date;

  @Column({ type: 'date' })
  @ApiProperty()
  @IsDate()
  fechaCaducidad: Date;

  @Column({ type: 'int', default: 0 })
  @ApiProperty()
  @IsNumber()
  cantidad: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty()
  @IsString()
  status: string;

  @ManyToOne(
    () => InsumoDepartamento,
    (insumoDepartamento) => insumoDepartamento.lotes,
  )
  @JoinColumn({ name: 'insumoDepartamentoId' })
  insumoDepartamento: InsumoDepartamento; // Relación con InsumoDepartamento

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean = true; // Soft delete
}
