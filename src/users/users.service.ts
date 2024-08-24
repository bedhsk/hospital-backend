import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { RolesService } from './roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  findAll() {
    const record = this.usersRepository.find({
      where: { is_Active: true },
      relations: ['role'],
    });
    return record;
  }

  async findOne(id: number) {
    const record = await this.usersRepository.findOne({ where: { id }, relations: ['role']});
    if (record === null) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    return record;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, ...userData } = createUserDto;
    const role = await this.rolesService.findOne(createUserDto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({ ...userData, role });
    return this.usersRepository.save(user);
  }

  async update(id: number, update_user: UpdateUserDto) {
    const user = await this.findOne(id);
    const { roleId, ...userData } = update_user;
    const role = await this.rolesService.findOne(update_user.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    this.usersRepository.merge(user, {...userData, role});
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    user.is_Active = false;
    await this.usersRepository.save(user);
  }
}
