import { ApiProperty } from "@nestjs/swagger";
import IndiceInsumo from "src/indice_insumos/entities/indice_insumo.entity";
import Lote from "src/lotes/entities/lote.entity";
import MovimientoInsumo from "src/movimiento_insumos/entities/movimiento_insumo.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('insumos')
class Insumo {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ type: 'boolean', default: false })
    @ApiProperty()
    trazador: boolean;

    @Column({ type: 'varchar', length: 12 })
    @ApiProperty()
    codigo: string;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    @ApiProperty()
    categoria: string;

    @Column({ type: 'varchar', length: 100 })
    @ApiProperty()
    departamento: string;

    @OneToMany(() => IndiceInsumo, (indiceInsumo) => indiceInsumo.insumo)
    @ApiProperty({ type: () => IndiceInsumo, isArray: true })
    indices: IndiceInsumo[];

    @OneToMany(() => Lote, (lote) => lote.insumo)
    @ApiProperty({ type: () => Lote, isArray: true })
    lotes: Lote[];

    @OneToMany(() => MovimientoInsumo, (movimientoInsumo) => movimientoInsumo.insumo)
    @ApiProperty({ type: () => MovimientoInsumo, isArray: true })
    movimientos: MovimientoInsumo[];
}
export default Insumo;