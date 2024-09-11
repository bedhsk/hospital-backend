import { ApiProperty } from '@nestjs/swagger';
import InsumoDepartamento from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('departamentos')
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

  @Column({ default: true })
  @ApiProperty({
    description: 'Muestra si el usuario esta activo para su uso',
  })
  is_Active: boolean;

  @OneToMany(() => InsumoDepartamento, (insumoDepartamento) => insumoDepartamento.departamento)
    insumosDepartamentos: InsumoDepartamento[];
}
