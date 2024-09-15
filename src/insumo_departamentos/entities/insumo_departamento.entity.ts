import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Insumo from 'src/insumos/entities/insumo.entity';
import Departamento from 'src/departamentos/entities/departamento.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsBoolean } from 'class-validator';
import Lote from 'src/lotes/entities/lote.entity';

@Entity('insumoDepartamento')
class InsumoDepartamento {
    //@PrimaryColumn('uuid')
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
   // @IsUUID()
    id: string;  // UUID

    @Column({ type: 'float' })
    @ApiProperty()
    @IsNumber()
    existencia: number;

    @ManyToOne(() => Insumo, (insumo) => insumo.insumosDepartamentos)
    insumo: Insumo;  // Relación con Insumo

    @ManyToOne(() => Departamento, (departamento) => departamento.insumosDepartamentos)
    departamento: Departamento;  // Relación con Departamento

    @OneToMany(() => Lote, (lote) => lote.insumoDepartamento)
    lotes: Lote[];  // Relación con Lote

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    @IsBoolean()
    is_active: boolean = true;  // Soft delete
}

export default InsumoDepartamento;
