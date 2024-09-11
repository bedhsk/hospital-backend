import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
  ) { }

  async findAll(query: QueryUserDto) {
    const { q, filter, page, limit } = query;
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .where({ is_Active: true })
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.id',
        'user.name',
        'user.lastname',
        'user.username',
        'user.email',
        'user.createdAt',
        'user.updatedAt',
        'role.id',
        'role.name'
      ]);

    if (q) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `${q}` });
    }

    if (filter) {
      queryBuilder.andWhere('role.name = :role', { role: `${filter}` });
    }

    const totalItems = await queryBuilder.getCount();

    const users = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: users,
      totalItems,
      totalPages,
      page,
    };
  }

  async findOne(id: string) {
    const record = await this.usersRepository.findOne({ where: { id, is_Active: true }, relations: ['role'] });
    if (record === null) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    return record;
  }

  async findOneByUsername(username: string) {
    const record = await this.usersRepository.findOne({ where: { username, is_Active: true }, relations: ['role'] });
    if (record === null) {
      throw new NotFoundException(`Usuario #${username} no encontrado`);
    }
    return record;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, username, ...userData } = createUserDto;
    const role = await this.rolesService.findOne(createUserDto.roleId);

    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({ ...userData, role, username });
    return this.usersRepository.save(user);
  }

  async update(id: string, update_user: UpdateUserDto) {
    const user = await this.findOne(id);
    const { roleId, username, ...userData } = update_user;

    // Verificar si el username existe y es diferente al del usuario actual
    if (username && username !== user.username) {
      const existingUser = await this.usersRepository.findOne({ where: { username } });
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
      user.username = username;
    }

    // Verificar si se envió un roleId y actualizar solo si se envía
    if (roleId) {
      const role = await this.rolesService.findOne(roleId);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      user.role = role;
    }

    // Si se envía un password, hashearlo antes de actualizar
    if (userData.password !== undefined) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    // Mergear los otros datos del usuario
    this.usersRepository.merge(user, userData);

    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.is_Active = false;
    await this.usersRepository.save(user);
  }
}
