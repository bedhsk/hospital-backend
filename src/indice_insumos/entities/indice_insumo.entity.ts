import { ApiProperty } from "@nestjs/swagger";
import Insumo from "src/insumos/entities/insumo.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('indice_insumos')
class IndiceInsumo {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToOne(() => Insumo, (insumo) => insumo.indices)
    @ApiProperty({ type: () => Insumo })
    insumo: Insumo;

    @Column({ type: 'int', default: 0 })
    @ApiProperty()
    promedio_demanda_real: number;

    @Column({ type: 'int', default: 0 })
    @ApiProperty()
    existencia_fisica: number;

    @Column({ type: 'varchar', length: 50 })
    @ApiProperty()
    puesto: string;

}
export default IndiceInsumo;