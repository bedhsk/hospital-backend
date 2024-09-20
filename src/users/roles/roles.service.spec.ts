import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import Role from '../entities/role.entity';
import CreateRoleDto from '../dto/create-role.dto';
import UpdateRoleDto from '../dto/update-role.dto';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;

  const mockRole: Role = {
    id: '59271b3e-e4ca-4434-8064-048a094ec8dc',
    name: 'Admin',
    users: [], 
  };

  // Simulaciones del repositorio
  const mockRoleRepository = {
    find: jest.fn().mockResolvedValue([mockRole]),
    findOne: jest.fn().mockImplementation((options: any) => {
      if (typeof options === 'object' && options.where && options.where.id) {
        return Promise.resolve(mockRole.id === options.where.id ? mockRole : null);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockReturnValue(mockRole),
    save: jest.fn().mockResolvedValue(mockRole),
    merge: jest.fn().mockReturnValue(mockRole),
    remove: jest.fn().mockResolvedValue(mockRole),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería devolver un array de roles', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockRole]);
    });
  });

  describe('findOne', () => {
    it('debería devolver un rol único por ID', async () => {
      const result = await service.findOne(mockRole.id);
      expect(result).toEqual(mockRole);
    });

    it('debería lanzar una NotFoundException si el rol no se encuentra', async () => {
      mockRoleRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debería crear y devolver un nuevo rol', async () => {
      const createRoleDto: CreateRoleDto = { name: 'Admin' };
      const result = await service.create(createRoleDto);
      expect(result).toEqual(mockRole);
      expect(repository.create).toHaveBeenCalledWith(createRoleDto);
      expect(repository.save).toHaveBeenCalledWith(mockRole);
    });
  });

  describe('update', () => {
    it('debería actualizar y devolver el rol', async () => {
      const updateRoleDto: UpdateRoleDto = { name: 'User' };
      const result = await service.update(mockRole.id, updateRoleDto);
      expect(result).toEqual(mockRole);
      expect(repository.merge).toHaveBeenCalledWith(mockRole, updateRoleDto);
      expect(repository.save).toHaveBeenCalledWith(mockRole);
    });

    it('debería lanzar una NotFoundException si el rol a actualizar no se encuentra', async () => {
      mockRoleRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(service.update('invalid-id', { name: 'User' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar y devolver el rol', async () => {
      const result = await service.remove(mockRole.id);
      expect(result).toEqual(mockRole);
      expect(repository.remove).toHaveBeenCalledWith(mockRole);
    });

    it('debería lanzar una NotFoundException si el rol a eliminar no se encuentra', async () => {
      mockRoleRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
