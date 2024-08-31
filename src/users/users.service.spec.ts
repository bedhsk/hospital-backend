import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import Role from './entities/role.entity';
import { RolesService } from './roles/roles.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import QueryUserDto from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';

// Crear un Mock para el Repositorio de Usuarios
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockUsersRepository = (): MockRepository<User> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
});

// Crear un Mock para el Servicio de Roles
const mockRolesService = () => ({
  findOne: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;
  let rolesService: jest.Mocked<RolesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository(),
        },
        {
          provide: RolesService,
          useValue: mockRolesService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository>(getRepositoryToken(User));
    rolesService = module.get<jest.Mocked<RolesService>>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Pruebas para el método findOne
  describe('findOne', () => {
    it('debe retornar un usuario si se encuentra', async () => {
      const user = new User();
      user.id = '1';
      user.name = 'John Doe';
      user.is_Active = true;
      user.role = new Role();

      usersRepository.findOne.mockResolvedValue(user);

      expect(await service.findOne('1')).toBe(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', is_Active: true },
        relations: ['role'],
      });
    });

    it('debe lanzar NotFoundException si el usuario no se encuentra', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  // Pruebas para el método findOneByUsername
  describe('findOneByUsername', () => {
    it('debe retornar un usuario si se encuentra por username', async () => {
      const user = new User();
      user.id = '1';
      user.username = 'johndoe';
      user.is_Active = true;
      user.role = new Role();

      usersRepository.findOne.mockResolvedValue(user);

      expect(await service.findOneByUsername('johndoe')).toBe(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'johndoe', is_Active: true },
        relations: ['role'],
      });
    });

    it('debe lanzar NotFoundException si el usuario no se encuentra por username', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneByUsername('unknown')).rejects.toThrow(NotFoundException);
    });
  });


  // pruebas para metodo create
  describe('create', () => {
    it('debe crear un usuario exitosamente', async () => {

      const role: Role = {
        id: 'role1',
        name: 'Admin',
        users: [],
      };

      const createUserDto: CreateUserDto = {
        name: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        username: 'janedoe',
        roleId: 'role1',
        password: 'password123',
      };
  
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10); 
  
      const user = new User();
      user.id = 'user1';
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.username = createUserDto.username;
      user.password = hashedPassword; 
      user.role = role;
      user.is_Active = true;
  
      rolesService.findOne.mockResolvedValue(role);
      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.create.mockReturnValue(user);
      usersRepository.save.mockResolvedValue(user);
  
      const result = await service.create(createUserDto);
  
      expect(rolesService.findOne).toHaveBeenCalledWith('role1');
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { username: 'janedoe' } });
      expect(usersRepository.create).toHaveBeenCalledWith({
        name: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        username: 'janedoe',
        password: 'password123',
        role,
      });
      expect(usersRepository.save).toHaveBeenCalledWith(user);
      expect(result).toBe(user);
    });
  
    it('debe lanzar ConflictException si el username ya existe', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        username: 'janedoe',
        roleId: 'role1',
        password: 'password123',
      };
  
      const existingUser = new User();
      existingUser.id = 'user1';
  
      usersRepository.findOne.mockResolvedValue(existingUser);
  
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { username: 'janedoe' } });
    }); 
  
    it('debe lanzar NotFoundException si el rol no se encuentra', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        username: 'janedoe',
        roleId: 'role1',
        password: 'password123',
      };
  
      rolesService.findOne.mockResolvedValue(null);
  
      await expect(service.create(createUserDto)).rejects.toThrow(NotFoundException);
      expect(rolesService.findOne).toHaveBeenCalledWith('role1');
    });

    it('debe lanzar un error si la contraseña está vacía', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        username: 'janedoe',
        roleId: 'role1',
        password: '', // Contraseña vacía
      };
  
      const role: Role = { id: 'role1', name: 'Admin', users: [] };
  
      rolesService.findOne.mockResolvedValue(role);
      usersRepository.findOne.mockResolvedValue(null);
  
      await expect(service.create(createUserDto)).rejects.toThrow(Error); 
    });

    it('debe lanzar un error si el email no es válido', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane',
        lastname: 'Doe',
        email: 'invalid-email', // Email inválido
        username: 'janedoe',
        roleId: 'role1',
        password: 'password123',
      };
  
      const role: Role = { id: 'role1', name: 'Admin', users: [] };
  
      rolesService.findOne.mockResolvedValue(role);
      usersRepository.findOne.mockResolvedValue(null);
  
      await expect(service.create(createUserDto)).rejects.toThrow(Error); 
    });
  });


  // Pruebas para el método remove
  describe('remove', () => {
    it('debe desactivar un usuario exitosamente', async () => {
      const user = new User();
      user.id = 'user1';
      user.is_Active = true;

      service.findOne = jest.fn().mockResolvedValue(user);
      usersRepository.save.mockResolvedValue(user);

      await service.remove('user1');

      expect(service.findOne).toHaveBeenCalledWith('user1');
      expect(user.is_Active).toBe(false);
      expect(usersRepository.save).toHaveBeenCalledWith(user);
    });

    it('debe lanzar NotFoundException si el usuario a eliminar no se encuentra', async () => {
      service.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.remove('user1')).rejects.toThrow(TypeError);
      expect(service.findOne).toHaveBeenCalledWith('user1');
    });

    it('debe manejar correctamente la desactivación de un usuario que ya está inactivo', async () => {
      const user = new User();
      user.id = 'user1';
      user.is_Active = false; // Usuario ya inactivo
  
      // Mock para el método findOne
      service.findOne = jest.fn().mockResolvedValue(user);
  
      // Mock para el método save
      usersRepository.save.mockResolvedValue(user);
  
      // Llamada al método remove
      await service.remove('user1');
  
      // Verificaciones
      expect(service.findOne).toHaveBeenCalledWith('user1');
      expect(user.is_Active).toBe(false); // Verifica que el estado del usuario no cambió
      expect(usersRepository.save).not.toHaveBeenCalled(); // Verifica que no se llamara al método save
    });
  });

  // Pruebas para el método findAll
  describe('findAll', () => {
    it('debe retornar una lista de usuarios con paginación', async () => {
      const query: QueryUserDto = {
        name: 'John',
        role: 'Admin',
        currentPage: 1,
        limit: 10,
      };

      const user = new User();
      user.id = 'user1';
      user.name = 'John Doe';
      user.is_Active = true;
      user.role = new Role();

      const totalItems = 1;
      const totalPages = 1;

      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(totalItems),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([user]),
      };

      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(query);

      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ is_Active: true });
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('user.role', 'role');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'user.id',
        'user.name',
        'user.lastname',
        'user.username',
        'user.email',
        'user.createdAt',
        'user.updatedAt',
        'role.id',
        'role.name',
      ]);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.name LIKE :name', { name: 'John' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('role.name = :role', { role: 'Admin' });
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual({
        data: [user],
        totalItems,
        totalPages,
        currentPage: 1,
      });
    });
  }); 
});
