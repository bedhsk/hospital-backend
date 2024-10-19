import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';
import Insumo from 'src/insumos/entities/insumo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categoria')
class Categoria {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string; // UUID

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  @IsString()
  nombre: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean; // Soft delete

  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[];
}

export default Categoria;
