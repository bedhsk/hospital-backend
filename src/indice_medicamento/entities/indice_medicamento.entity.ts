import { ApiProperty } from "@nestjs/swagger";
import Medicamento from "src/medicamentos/entities/medicamento.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('indice_medicamentos')
class IndiceMedicamento {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToOne(() => Medicamento, (medicamento) => medicamento.indices)
    @ApiProperty({ type: () => Medicamento })
    medicamento: Medicamento;

    @Column({ type: 'int'})
    @ApiProperty()
    promedio_demanda_real: number;

    @Column({ type: 'int'})
    @ApiProperty()
    excelencia_fisica: number;

    @Column({ type: 'float'})
    @ApiProperty()
    existencia_fisica: number;

}
export default IndiceMedicamento;