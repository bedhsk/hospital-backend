import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { RolesService } from './roles/roles.service';
import * as bcrypt from 'bcrypt';
import QueryUserDto from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(query: QueryUserDto) {
    const { name, role, currentPage, limit} = query;
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.role', 'role')
    .select([
      'user.id',
      'user.name',
      'user.lastname',
      'user.username',
      'user.email',
      'role.id',
      'role.name'
    ]);

    if (name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `${name}` });
    }

    if (role) {
      queryBuilder.andWhere('role.name = :role', { role });
    }

    const totalItems = await queryBuilder.getCount();

    const users = await queryBuilder
      .skip((currentPage - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: users,
      totalItems,
      totalPages,
      currentPage,
    };
  }

  async findOne(id: string) {
    const record = await this.usersRepository.findOne({ where: { id, is_Active: true}, relations: ['role']});
    if (record === null) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    return record;
  }

  async findOneByUsername(username: string) {
    const record = await this.usersRepository.findOne({ where: { username, is_Active: true }, relations: ['role']});
    if (record === null) {
      throw new NotFoundException(`Usuario #${username} no encontrado`);
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

  async update(id: string, update_user: UpdateUserDto) {
    const user = await this.findOne(id);
    const { roleId, ...userData } = update_user;
    const role = await this.rolesService.findOne(update_user.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    console.log(userData.password)
    if (userData.password !== undefined){
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    this.usersRepository.merge(user, {...userData, role});
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.is_Active = false;
    await this.usersRepository.save(user);
  }
}
