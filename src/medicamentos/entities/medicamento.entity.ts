import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('medicamentos')
class Medicamento {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    categoria: string;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    codigo: string;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    medicamento: string;

    @Column({ type: 'int'})
    @ApiProperty()
    promedio_mensual: number;

    @Column({ type: 'int'})
    @ApiProperty()
    existencia: number;

    @Column({ type: 'float'})
    @ApiProperty()
    meses_existencia: number;
}