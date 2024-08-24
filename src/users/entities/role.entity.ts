import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('roles')
class Role {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'ID unico para los Roles',
      })
    id: number;

    @Column({ type: 'varchar', length: 60})
    @ApiProperty({
        description: 'Nombre con el cual se identifica el Role',
      })
    name: string;

    @OneToMany(() => User, (user) => user.role)
    @ApiProperty({
        description: 'Relacion entre roles y usuarios, un role pueden tenerlo varios usuarios',
      })
    users: User[];
}

export default Role;