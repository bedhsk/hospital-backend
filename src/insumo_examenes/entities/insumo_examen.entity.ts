import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Insumo from 'src/insumos/entities/insumo.entity';
import Examen from 'src/examenes/entities/examen.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('insumoExamen')  // Nombre de la tabla en la base de datos
class InsumoExamen {
  @PrimaryGeneratedColumn('uuid')  // Genera un UUID automáticamente
  @ApiProperty()
  id: string;

  @Column({ type: 'int', default: 0 })  // Cantidad de insumos utilizados en el examen
  @ApiProperty()
  cantidad: number;

  @ManyToOne(() => Insumo, (insumo) => insumo.insumoExamenes, { nullable: false })  // Relación con Insumo
  insumo: Insumo;

  @ManyToOne(() => Examen, (examen) => examen.insumoExamenes, { nullable: false })
  examen: Examen;

  @Column({ type: 'boolean', default: true })  // Campo para soft delete
  @ApiProperty()
  is_active: boolean;
}

export default InsumoExamen;
