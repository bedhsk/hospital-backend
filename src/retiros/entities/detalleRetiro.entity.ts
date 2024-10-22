import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Retiro from './retiro.entity';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';

@Entity('detalleRetiro')
export default class DetalleRetiro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  @ApiProperty({
    description:
      'Muestra si el detalle retiro se encuetra activo (sirve para el SoftDelete)',
  })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description:
      'Fecha de Creaciòn del detalle retiro se inserta automaticamente',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description: 'Ultima fecha de modificaciòn del detalle retiro',
  })
  updatedAt: Date;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Cantidad retirada' })
  @IsNumber()
  cantidad: number;

  @ManyToOne(() => Retiro, (retiro) => retiro.detalleRetiro)
  @JoinColumn({ name: 'retiroId' })
  retiro: Retiro;

  @ManyToOne(
    () => InsumoDepartamento,
    (insumoDepartamento) => insumoDepartamento.lotes,
  )
  @JoinColumn({ name: 'insumoDepartamentoId' })
  insumoDepartamento: InsumoDepartamento;
}
