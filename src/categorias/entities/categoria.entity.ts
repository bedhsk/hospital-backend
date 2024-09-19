import { Entity, PrimaryColumn, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean } from 'class-validator';
//import Insumo from '../../insumos/entities/insumo.entity';
import Insumo from '../../insumos/entities/insumo.entity'

@Entity('categoria')
class Categoria {
    //@PrimaryColumn('uuid')
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    //@IsUUID()
    id: string;  // UUID

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    @IsString()
    nombre: string;

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    @IsBoolean()
    is_active: boolean = true;  // Soft delete

    @OneToMany(() => Insumo, (insumo) => insumo.categoria)
    insumos: Insumo[];
}

export default Categoria;
