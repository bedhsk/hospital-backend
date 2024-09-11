import { IsUUID, IsString, IsBoolean, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCategoriaDto {
    @IsUUID()
    @ApiProperty()
    id: string;  // UUID proporcionado para la categoría

    @IsString()
    @MaxLength(255)
    @ApiProperty()
    nombre: string;  // Nombre de la categoría

    @IsBoolean()
    @ApiProperty({ default: true })
    is_active?: boolean = true;  // Activo por defecto, booleano opcional
}
