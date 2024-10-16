import { IsUUID, IsString, MaxLength, IsNotEmpty, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import CreateInsumoExamenDto from 'src/insumo_examenes/dtos/create-insumo_examen.dto';


export default class CreateExamenDto {
  @IsString() 
  @MaxLength(50)
  @IsNotEmpty()
  nombre: string;

  @IsString() 
  @MaxLength(255)
  descripcion: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean = true;

  // Aquí agregamos los insumos
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInsumoExamenDto)
  insumos: CreateInsumoExamenDto[]; // Array con los insumos del examen
}
