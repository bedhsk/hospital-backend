import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import Role from "./role.entity";
@Entity('users')
export default class User {
    
@PrimaryGeneratedColumn()
id: number;
@Column({type: 'varchar', length: 60 })
name: String;

@Column({type: 'varchar', length: 60 })
lastname: String;

@Column({type: 'varchar', length: 50 })
username: String;

@Column({type: 'varchar' })
email: String;

@ManyToOne(()=>Role,(role)=>role.users)
role: Role;

@Column({type: 'varchar'})
password: String;
@BeforeInsert()
async hashPassword(){
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(this.password, saltOrRounds);
    this.password = hash;
}
     }