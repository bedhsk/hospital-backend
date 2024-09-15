import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import Role from './role.entity';
import { ApiProperty } from '@nestjs/swagger';
import Receta from 'src/recetas/entities/receta.entity';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Id Unico de usuario',
  })
  id: string;

  @Column({ type: 'varchar', length: 60 })
  @ApiProperty({
    description: 'Nombre del empleado',
  })
  name: string;

  @Column({ type: 'varchar', length: 60 })
  @ApiProperty({
    description: 'Apellido del empleado',
  })
  lastname: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({
    description: 'Nombre de usuario del empleado',
  })
  username: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Direccion de correo Electronico del empleaod',
  })
  email: string;

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

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  @ApiProperty({
    description:
      'Relaciòn entre Usarios y Roles. Un usuario puede tener solo un rol',
  })
  role: Role;

  @OneToMany(() => Receta, (Receta) => Receta.user)
  @ApiProperty({
    description:
      'Relaciòn entre Usuarios y Recetas. Un usuario puede generar varias recetas',
  })
  recetas: Receta[];

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Contraseña de acceso para el usuario',
  })
  password: string;
  @BeforeInsert()
  async hashPassword() {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(this.password, saltOrRounds);
    this.password = hash;
  }
}
