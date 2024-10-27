import { IsUUID, IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { EstadoOrdenLaboratorio } from '../enum/estado-orden-laboratorio.enum';

export default class CreateOrdenLaboratorioDto {
    @IsUUID()
    @IsNotEmpty()
    usuarioId: string;

    @IsUUID()
    @IsOptional()
    retiroId?: string;

    @IsUUID()
    @IsNotEmpty()
    pacienteId: string;

    @IsUUID()
    @IsNotEmpty()
    examenId: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsEnum(EstadoOrdenLaboratorio)
    estado: EstadoOrdenLaboratorio;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean = true;
}
