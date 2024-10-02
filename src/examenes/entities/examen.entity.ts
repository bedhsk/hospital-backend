import OrdenLaboratorio from 'src/orden_laboratorios/entities/orden_laboratorio.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('examen')
class Examen {
  @PrimaryGeneratedColumn('uuid')  // Genera automáticamente un UUID
  id: string;

  @Column({ type: 'varchar', length: 50 })  // Nombre del examen, longitud máxima de 50 caracteres
  nombre: string;

  @Column({ type: 'varchar', length: 255 })  // Descripción del examen, longitud máxima de 255 caracteres
  descripcion: string;

  @Column({ type: 'boolean', default: true })  // Campo para el soft delete, se inicializa como true (activo)
  is_active: boolean;
    insumoExamen: any;

    @OneToMany(() => OrdenLaboratorio, (ordenLaboratorio) => ordenLaboratorio.examen)
    ordenesLaboratorio: OrdenLaboratorio[];
}
export default Examen;
