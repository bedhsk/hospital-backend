import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Antecedente from './antecedente.entity';

@Entity('pacientes')
export default class Paciente {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Id Unico de paciente',
  })
  id: string;

  @Column({ type: 'varchar', length: 60 })
  @ApiProperty({
    description: 'Nombre del paciente',
  })
  nombre: string;

  @Column({ type: 'varchar', length: 10 })
  sexo: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  @ApiProperty({
    description: 'Nombre del paciente',
  })
  cui?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description: 'Fecha de Creaciòn del Paciente se inserta automaticamente',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description:
      'Ultima fecha de modificaciòn de la informacion de los usuarios',
  })
  updatedAt: Date;

  @Column({ type: 'date' })
  @ApiProperty({
    description: 'Fecha Nacimineto Paciente',
  })
  nacimiento: Date;

  @Column({ default: true })
  @ApiProperty({
    description:
      'Muestra si el paciente se encuetra activo (sirve para el SoftDelete)',
  })
  is_active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Nombre de Familiares del Paciente',
  })
  familiares?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Nombre de los medicos del paciente',
  })
  medicos?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Nombre de los quirurgicos usados en el paciente',
  })
  quirurgicos?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Nombre de los traumaticos que sufre el paciente',
  })
  traumaticos?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Nombre de los alergias que sufre el paciente',
  })
  alergias?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    description: 'Nombre de los vicios que tiene el paciente',
  })
  vicios?: string;

  @OneToOne(() => Antecedente, (antecedente) => antecedente.paciente, {
    cascade: true,
  })
  @JoinColumn()
  @ApiProperty({
    description:
      'Relacion entre Paciente y Antecedentes. Un paciente tiene un único antecedente.',
  })
  antecedente: Antecedente;

  ordenesLaboratorio: any;
}
