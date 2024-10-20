import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

class CreateAntecedenteDto {
  @IsUUID()
  pacienteId: string;

  @IsInt()
  @IsOptional()
  gestas?: number;

  @IsInt()
  @IsOptional()
  hijos_vivos?: number;

  @IsInt()
  @IsOptional()
  hijos_muertos?: number;

  @IsInt()
  @IsOptional()
  abortos?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  ultima_regla?: Date;

  @IsInt()
  @IsOptional()
  planificacion_familiar?: string;

  @IsInt()
  @IsOptional()
  partos?: number;

  @IsInt()
  @IsOptional()
  cesareas?: number;
}

export default CreateAntecedenteDto;
