import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean, MaxLength } from 'class-validator';

@Entity('categorias')
class Categoria {
    @PrimaryColumn('uuid')
    @ApiProperty()
    @IsUUID()
    id: string;  // Clave primaria, UUID

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    @IsString()
    @MaxLength(255)
    nombre: string;  // Nombre de la categoría, string

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    @IsBoolean()
    is_active: boolean = true;  // Soft delete, booleano con valor por defecto true
}

export default Categoria;
