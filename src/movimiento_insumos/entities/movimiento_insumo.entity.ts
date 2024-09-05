import { ApiProperty } from "@nestjs/swagger";
import Insumo from "src/insumos/entities/insumo.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('movimiento_insumo')
class MovimientoInsumo {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToOne(() => Insumo, (insumo) => insumo.movimientos)
    @ApiProperty({ type: () => Insumo })
    insumo: Insumo;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty()
    fecha: Date;

    @Column({ type: 'int' })
    @ApiProperty()
    cantidad: number;

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    ingreso: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @ApiProperty()
    descripcion: string;
}
export default MovimientoInsumo;
