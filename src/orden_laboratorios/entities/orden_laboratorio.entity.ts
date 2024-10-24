import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Paciente from '../../pacientes/entities/paciente.entity';
import Examen from '../../examenes/entities/examen.entity';
import User from '../../users/entities/user.entity';
import Retiro from '../../retiros/entities/retiro.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean } from 'class-validator';
import { EstadoOrdenLaboratorio } from '../enum/estado-orden-laboratorio.enum';

@Entity('ordenLaboratorio')
class OrdenLaboratorio {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column({ type: 'text' })
    @ApiProperty()
    @IsString()
    descripcion: string;

    @Column({ type: 'enum', enum: EstadoOrdenLaboratorio, default: EstadoOrdenLaboratorio.PENDIENTE })
    @ApiProperty({
        description: 'Estado de la orden de laboratorio',
        enum: EstadoOrdenLaboratorio,
        example: EstadoOrdenLaboratorio.PENDIENTE,
    })
    estado: EstadoOrdenLaboratorio;
    

    @ManyToOne(() => User, (usuario) => usuario.ordenesLaboratorio)
    usuario: User;

    @ManyToOne(() => Retiro, (retiro) => retiro.ordenesLaboratorio, { nullable: true })
    retiro: Retiro;

    @ManyToOne(() => Paciente, (paciente) => paciente.ordenesLaboratorio)
    paciente: Paciente;

    @ManyToOne(() => Examen, (examen) => examen.ordenesLaboratorio, { nullable: false })
    examen: Examen;


    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    @IsBoolean()
    is_active: boolean = true;
}

export default OrdenLaboratorio;
