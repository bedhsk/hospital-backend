import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Insumo from 'src/insumos/entities/insumo.entity';
import Examen from 'src/examenes/entities/examen.entity';

@Entity('insumoExamen') // Nombre de la tabla en la base de datos
class InsumoExamen {
  @PrimaryGeneratedColumn('uuid') // Genera un UUID automáticamente
  id: string;

  @Column({ type: 'int', default: 0 }) // Cantidad de insumos utilizados en el examen
  cantidad: number;

  @Column({ type: 'int', default: null })
  cada_horas: number;

  @Column({ type: 'int', default: null })
  por_dias: number;

  @ManyToOne(() => Insumo, (insumo) => insumo.insumoExamenes, {
    nullable: false,
  }) // Relación con Insumo
  insumo: Insumo;

  @ManyToOne(() => Examen, (examen) => examen.insumoExamen, { nullable: false }) // Relación con Examen
  examen: Examen;

  @Column({ type: 'boolean', default: true }) // Campo para soft delete
  is_active: boolean;
}

export default InsumoExamen;
