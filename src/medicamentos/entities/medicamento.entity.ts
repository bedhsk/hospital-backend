import { ApiProperty } from "@nestjs/swagger";
import IndiceMedicamento from "src/indice_medicamento/entities/indice_medicamento.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('medicamentos')
class Medicamento {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    trazador: boolean;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    categoria: string;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    codigo: string;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    nombre: string;

    @OneToMany(() => IndiceMedicamento, (indiceMedicamento) => indiceMedicamento.medicamento)
    @ApiProperty({ type: () => IndiceMedicamento, isArray: true })
    indices: IndiceMedicamento[];
}
export default Medicamento;