import { ApiProperty } from '@nestjs/swagger';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('departamento')
export default class Departamento {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Id Unico de usuario',
  })
  id: string;

  @Column({ type: 'varchar', length: 60 })
  @ApiProperty({
    description: 'Nombre del departamento',
  })
  nombre: string;

  // METADATA
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
  is_active: boolean;

  @OneToMany(
    () => InsumoDepartamento,
    (insumoDepartamento) => insumoDepartamento.departamento,
  )
  insumosDepartamentos: InsumoDepartamento[];
}
