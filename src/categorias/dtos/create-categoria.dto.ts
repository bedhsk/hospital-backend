import { IsUUID, IsString, IsBoolean, MaxLength, IsOptional } from 'class-validator';

export default class CreateCategoriaDto {
    @IsString()
    @MaxLength(255)
    nombre: string;  // Nombre de la categoría
}
