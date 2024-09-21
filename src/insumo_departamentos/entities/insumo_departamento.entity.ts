import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean } from 'class-validator';
import Departamento from 'src/departamentos/entities/departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import Lote from 'src/lotes/entities/lote.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('insumoDepartamento')
export class InsumoDepartamento {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  // @IsUUID()
  id: string; // UUID

  @Column({ type: 'float' })
  @ApiProperty()
  @IsNumber()
  existencia: number;

  @ManyToOne(() => Insumo, (insumo) => insumo.insumosDepartamentos)
  @JoinColumn({ name: 'insumoId' })
  insumo: Insumo;

  @ManyToOne(
    () => Departamento,
    (departamento) => departamento.insumosDepartamentos,
  )
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento; // Relación con Departamento

  @OneToMany(() => Lote, (lote) => lote.insumoDepartamento)
  lotes: Lote[]; // Relación con Lote

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean;
}
