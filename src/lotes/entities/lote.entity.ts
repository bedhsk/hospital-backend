import { Entity, PrimaryColumn, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Insumo from 'src/insumos/entities/insumo.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';
import InsumoDepartamento from 'src/insumo_departamentos/entities/insumo_departamento.entity';

@Entity('lote')
class Lote {
   // @PrimaryColumn('uuid')
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;  // UUID

    @Column({type: 'varchar', length: 255 })
    @ApiProperty()
    @IsString()
    numeroLote: string;

    @Column({ type: 'date' })
    @ApiProperty()
    @IsDate()
    fechaFabricacion: Date;

    @Column({ type: 'date' })
    @ApiProperty()
    @IsDate()
    fechaCaducidad: Date;

    @Column({ type: 'int', default: 0 })
    @ApiProperty()
    @IsNumber()
    cantidad: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @ApiProperty()
    @IsString()
    status: string;

    @ManyToOne(() => Insumo, (insumo) => insumo.lotes)
    insumo: Insumo;  // Relación con Insumo

    @ManyToOne(() => InsumoDepartamento, (insumoDepartamento) => insumoDepartamento.lotes)
    insumoDepartamento: InsumoDepartamento;  // Relación con InsumoDepartamento

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    @IsBoolean()
    is_active: boolean = true;  // Soft delete
}

export default Lote;
