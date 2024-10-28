import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDate } from 'class-validator';
import User from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Entity,
  CreateDateColumn,
} from 'typeorm';
import detalleAdquisicion from './detalle_adquisicion.entity';

@Entity('adquisicion')
export default class Adquisicion {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  @ApiProperty()
  @IsDate()
  created_at: Date;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  @IsString()
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  @IsBoolean()
  is_active: boolean; // Soft delete

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User; // Relación con Usuario

  @OneToMany(
    () => detalleAdquisicion,
    (detalleAdquisicion) => detalleAdquisicion.adquisicion,
  )
  detalleAdquisicion: detalleAdquisicion[];
}
