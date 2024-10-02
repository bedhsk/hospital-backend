import { ApiProperty } from "@nestjs/swagger";
import User from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import DetalleRetiro from "./detalleRetiro.entity";

@Entity('retiros')
export default  class Retiro{
    @PrimaryColumn('uuid')
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

    @OneToMany( () => DetalleRetiro, (detalleRetiro) => detalleRetiro.retiro)
    detalleRetiro: DetalleRetiro[];
    ordenesLaboratorio: any;
}
