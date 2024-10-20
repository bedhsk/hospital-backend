import { ApiProperty } from '@nestjs/swagger';
import Paciente from 'src/pacientes/entities/paciente.entity';
import User from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
    description: 'Fecha de Creaciòn del Usuario se inserta automaticamente',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  @ApiProperty({
    description:
      'Ultima fecha de modificaciòn de la informacion de los usuarios',
  })
  updatedAt: Date;

  @Column({ default: true })
  @ApiProperty({
    description: 'Muestra si el usuario esta activo para su uso',
  })
  is_Active: boolean;

  @ManyToOne(() => User, (user) => user.recetas)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description:
      'Relaciòn entre Usarios y Roles. Un usuario puede tener solo un rol',
  })
  user: User;

  @ManyToOne(() => Paciente, (paciente) => paciente.recetas)
  @JoinColumn({ name: 'pacienteId' })
  @ApiProperty({
    description:
      'Relación entre Pacientes y Recetas. Un paciente puede tener varias recetas',
  })
  paciente: Paciente;
}
