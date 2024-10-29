import { ApiProperty } from "@nestjs/swagger";
import User from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import DetalleRetiro from "./detalleRetiro.entity";
import OrdenLaboratorio from "src/orden_laboratorios/entities/orden_laboratorio.entity";
import Receta from "src/recetas/entities/receta.entity";

@Entity('retiros')
export default  class Retiro{
  @PrimaryGeneratedColumn('uuid')
  id: string;

    @Column({ default: true})
    @ApiProperty({
      description: 'Muestra si el retiro se encuetra activo (sirve para el SoftDelete)',
    })
    is_active: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    @ApiProperty({
      description: 'Fecha de Creaciòn del retiro se inserta automaticamente',
    })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    @ApiProperty({
      description:
        'Ultima fecha de modificaciòn del retiro',
    })
    updatedAt: Date;
    
    @Column({ type: 'varchar', length: 255, nullable:true })
    @ApiProperty({
      description: 'Descripcion del retiro',
    })
    descripcion?: string;


    @ManyToOne(()=>User,(user)=>user.retiros)
    @JoinColumn({ name: 'usuarioId' })
    @ApiProperty({
      description:
        'Relaciòn entre Retiros y Usuarios. Un retiro  solo puede ser de un usuario',
    })
    user: User;

    @ApiProperty({
      description:
        'Relaciòn entre Retiros y detalleRetiros',
    })
    @OneToMany( () => DetalleRetiro, (detalleRetiro) => detalleRetiro.retiro)
    detalleRetiro: DetalleRetiro[];
    @OneToMany(
      () => OrdenLaboratorio,
      (ordenLaboratorio) => ordenLaboratorio.retiro,
    )
    ordenesLaboratorio: OrdenLaboratorio[];

    @OneToOne(() => Receta, (receta) => receta.retiro, { nullable: true })
    @JoinColumn({ name: 'recetaId'}) 
    @ApiProperty({
      description: 
        'Relación entre Retiro y Receta. Un retiro puede estar asociado a una receta',
    })
    receta?: Receta;

}
