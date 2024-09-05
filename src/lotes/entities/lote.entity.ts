import { ApiProperty } from "@nestjs/swagger";
import Insumo from "src/insumos/entities/insumo.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('lote')
class Lote {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToOne(() => Insumo, (insumo) => insumo.lotes)
    @ApiProperty({ type: () => Insumo })
    insumo: Insumo;

    @Column({ type: 'varchar', length: 50 })
    @ApiProperty()
    numero_lote: string;

    @Column({ type: 'date' })
    @ApiProperty()
    fechaFabricacion: Date;

    @Column({ type: 'date' })
    @ApiProperty()
    fechaCaducidad: Date;

    @Column({ type: 'int', default: 0 })
    @ApiProperty()
    cantidad: number;
}
export default Lote;
