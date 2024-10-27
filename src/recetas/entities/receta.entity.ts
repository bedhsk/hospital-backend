// receta.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Paciente from 'src/pacientes/entities/paciente.entity';
import User from 'src/users/entities/user.entity';
import { EstadoReceta } from '../enum/estado-receta.enum';


@Entity('recetas')
export default class Receta {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Id Unico de recetas',
  })
  id: string;

  @Column({ type: 'varchar', length: 60 })
  @ApiProperty({
    description: 'Descripción de la receta',
  })
  descripcion: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description: 'Fecha de Creación de la receta, se inserta automáticamente',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description: 'Última fecha de modificación de la receta',
  })
  updatedAt: Date;

  @Column({ default: true })
  @ApiProperty({
    description: 'Indica si la receta está activa',
  })
  is_Active: boolean;

  @ManyToOne(() => User, (user) => user.recetas)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description: 'Relación entre receta y usuario que la creó',
  })
  user: User;

  @ManyToOne(() => Paciente, (paciente) => paciente.recetas)
  @JoinColumn({ name: 'pacienteId' })
  @ApiProperty({
    description: 'Relación entre receta y paciente asociado',
  })
  paciente: Paciente;

  @Column({ type: 'enum', enum: EstadoReceta, default: EstadoReceta.PENDIENTE })
  @ApiProperty({
    description: 'Estado de la receta',
    enum: EstadoReceta,
    example: EstadoReceta.PENDIENTE,
  })
  estado: EstadoReceta;
}
