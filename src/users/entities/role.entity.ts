import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity('roles')
class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 60})
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}

export default Role;