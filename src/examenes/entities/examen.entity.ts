import { ApiProperty } from '@nestjs/swagger';
import InsumoExamen from 'src/insumo_examenes/entities/insumo_examen.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('examen')
class Examen {
  @PrimaryGeneratedColumn('uuid')  // Genera automáticamente un UUID
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar', length: 50 })  // Nombre del examen, longitud máxima de 50 caracteres
  @ApiProperty()
  nombre: string;

  @Column({ type: 'varchar', length: 255 })  // Descripción del examen, longitud máxima de 255 caracteres
  @ApiProperty()
  descripcion: string;

  @Column({ type: 'boolean', default: true })  // Campo para el soft delete, se inicializa como true (activo)
  @ApiProperty()
  is_active: boolean;

  @OneToMany(() => InsumoExamen, (insumoExamen) => insumoExamen.examen)
  insumoExamenes: InsumoExamen[];  // Un examen puede tener múltiples insumos relacionados
}

export default Examen;
