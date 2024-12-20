import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Paciente from './paciente.entity';
import { IsOptional } from 'class-validator';

@Entity('antecedentes')
export default class Antecedente {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID unico para el antecedente',
  })
  id: string;

  @OneToOne(() => Paciente, (paciente) => paciente.antecedente)
  @ApiProperty({
    description:
      'Relaciòn entre Paciente y Antecedentes. Un antecedente pertenece a un solo paciente',
  })
  paciente: Paciente;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description: 'Fecha de Creaciòn del Antecedente se inserta automaticamente',
  })
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Numero de Gestas que ha tenido el paciente',
  })
  gestas?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Numero de hijos vivos del paciente',
  })
  hijos_vivos?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Numero hijos muertos que tiene el paciente',
  })
  hijos_muertos?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Numero de abortos que ha tenido el paciente',
  })
  abortos?: number;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Fecha de la ultima regla del paciente',
  })
  ultima_regla?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Planificacion familiar del paciente',
  })
  planificacion_familiar?: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Numero de partos que ha tenido el paciente',
  })
  partos?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Numero de cesareas que ha tenido el  paciente',
  })
  cesareas?: number;

  @Column({ default: true })
  @ApiProperty({
    description:
      'Muestra si el antecedente se encuetra activo (sirve para el SoftDelete)',
  })
  is_active: boolean;
}
