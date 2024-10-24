import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean } from 'class-validator';
import detalleAdquisicion from 'src/adquisiciones/entities/detalle_adquisicion.entity';
import Departamento from 'src/departamentos/entities/departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import Lote from 'src/lotes/entities/lote.entity';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';

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
    { onDelete: 'CASCADE' } // Esta línea asegura la eliminación en cascada
  )
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento; // Relación con Departamento

  @OneToMany(() => Lote, (lote) => lote.insumoDepartamento)
  lotes: Lote[]; // Relación con Lote

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean;

  @OneToMany(
    () => detalleAdquisicion,
    (detalleAdquisicion) => detalleAdquisicion.insumoDepartamento,
  )
  detalleAdquisicion: detalleAdquisicion[];

  @OneToMany(
    () => DetalleRetiro,
    (detalleRetiro) => detalleRetiro.insumoDepartamento,
  )
  detalleRetiro: DetalleRetiro[];
}
