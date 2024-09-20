import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';
import Categoria from 'src/categorias/entities/categoria.entity';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Entity,
} from 'typeorm';

@Entity('insumo')
export class Insumo {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar', length: 12 })
  @ApiProperty()
  @IsString()
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  @IsString()
  nombre: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  @IsBoolean()
  trazador: boolean = false;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean; // Soft delete

  @ManyToOne(() => Categoria, (categoria) => categoria.insumos)
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria; // Relación con Categoría

  @OneToMany(
    () => InsumoDepartamento,
    (insumoDepartamento) => insumoDepartamento.insumo,
  )
  insumosDepartamentos: InsumoDepartamento[];
}

export default Insumo;
