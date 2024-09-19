import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Categoria from '../../categorias/entities/categoria.entity';
//import Lote from 'src/lotes/entities/lote.entity';
import Lote from '../../lotes/entities/lote.entity';
import InsumoDepartamento from '../../insumo_departamentos/entities/insumo_departamento.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean } from 'class-validator';

@Entity('insumo')
class Insumo {
    //@PrimaryColumn('uuid')
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    //@IsUUID()
    id: string;  // UUID

    @Column({ type: 'varchar', length: 12 })
    @ApiProperty()
    @IsString()
    codigo: string;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    @IsString()
    nombre: string;

    @ManyToOne(() => Categoria, (categoria) => categoria.insumos)
    categoria: Categoria;  // Relación con Categoría

    @Column({ type: 'boolean', default: false })
    @ApiProperty()
    @IsBoolean()
    trazador: boolean = false;

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    @IsBoolean()
    is_active: boolean;  // Soft delete

    @OneToMany(() => Lote, (lote) => lote.insumo)
    lotes: Lote[];

    @OneToMany(() => InsumoDepartamento, (insumoDepartamento) => insumoDepartamento.insumo)
    insumosDepartamentos: InsumoDepartamento[];
}

export default Insumo;
