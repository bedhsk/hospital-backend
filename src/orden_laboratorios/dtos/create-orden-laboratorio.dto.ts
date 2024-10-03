import { IsUUID, IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    estado: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean = true;
}
