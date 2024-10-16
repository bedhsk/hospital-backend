import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { RolesService } from './roles/roles.service';
import * as bcrypt from 'bcrypt';
import QueryUserDto from './dto/query-user.dto';
import { DepartamentosService } from 'src/departamentos/departamentos.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly departamentosService: DepartamentosService,
  ) {}

  async findAll(queryDto: QueryUserDto) {
    const { q, filter, page, limit } = queryDto;
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where({ is_Active: true })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.departamento', 'departmento')
      .select([
        'user.id',
        'user.name',
        'user.lastname',
        'user.username',
        'user.email',
        'user.createdAt',
        'user.updatedAt',
        'role.id',
        'role.name',
        'departmento.id',
        'departmento.nombre',
      ]);

    if (q) {
      queryBuilder.andWhere(
        '(user.name ILIKE :query OR user.username ILIKE :query OR user.email ILIKE :query)',
        { query: `%${q}%` },
      );
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
    const record = await this.usersRepository.findOne({
      where: { id, is_Active: true },
      relations: ['role', 'departamento'],
    });
    if (record === null) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    return record;
  }

  async findOneByUsername(username: string) {
    const record = await this.usersRepository.findOne({
      where: { username, is_Active: true },
      relations: ['role', 'departamento'],
    });
    if (record === null) {
      throw new NotFoundException(`Usuario #${username} no encontrado`);
    }
    return record;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, departamentoId, username, ...userData } = createUserDto;
    const role = await this.rolesService.findOne(createUserDto.roleId);
    const departamento = await this.departamentosService.findOne(
      createUserDto.departamentoId,
    );

    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (!departamento) {
      throw new NotFoundException('Department not found');
    }

    const user = this.usersRepository.create({
      ...userData,
      role,
      username,
      departamento,
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, update_user: UpdateUserDto) {
    const user = await this.findOne(id);
    const { roleId, departamentoId, username, ...userData } = update_user;

    // Verificar si el username existe y es diferente al del usuario actual
    if (username && username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username },
      });
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

    // Verficar si se envió un departamentoId y actualizar solo si se envía
    if (departamentoId) {
      const department =
        await this.departamentosService.findOne(departamentoId);
      if (!department) {
        throw new NotFoundException('Department not found');
      }
      user.departamento = department;
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
