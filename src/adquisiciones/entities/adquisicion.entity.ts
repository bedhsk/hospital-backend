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
  Timestamp,
} from 'typeorm';
import detalleAdquisicion from './detalleAdquisicion.entity';

@Entity('adquisicion')
export default class Adquisicion {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar', length: 12 })
  @ApiProperty()
  @IsDate()
  created_at: Timestamp;

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
    () => detalleAdquisicion, (detalleAdquisicion) => detalleAdquisicion.adquisicion,
  )
  detalleAdquisicion: detalleAdquisicion[];
}
