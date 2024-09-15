import { ApiProperty } from '@nestjs/swagger';
import Paciente from 'src/pacientes/entities/paciente.entity';
import User from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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
      'Relaciòn entre Pacientes y Recetas. Un paciente puede tener varias recetas',
  })
  paciente: Paciente;
}
