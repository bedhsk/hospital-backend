import { Test, TestingModule } from '@nestjs/testing';
import { DepartamentosService } from './departamentos.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Departamento from './entities/departamento.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DepartamentosService', () => {
  let service: DepartamentosService;
  let repository: Repository<Departamento>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartamentosService,
        {
          provide: getRepositoryToken(Departamento),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<DepartamentosService>(DepartamentosService);
    repository = module.get<Repository<Departamento>>(getRepositoryToken(Departamento));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un departamento', async () => {
      const createDto = { nombre: 'Laboratorio' };
      const result = { id: 'some-id', ...createDto, is_Active: true };
      
      jest.spyOn(repository, 'create').mockReturnValue(result as any);
      jest.spyOn(repository, 'save').mockResolvedValue(result as any);

      expect(await service.create(createDto)).toEqual(result);
    });

    it('debería lanzar BadRequestException si los datos son inválidos', async () => {
      const invalidDto = { nombre: '' }; // Simulando un nombre vacío
      jest.spyOn(repository, 'create').mockReturnValue(null);
      jest.spyOn(repository, 'save').mockRejectedValue(new BadRequestException());

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('debería devolver un array de departamentos', async () => {
      const result = [{ id: 'some-id', nombre: 'Laboratorio', is_Active: true }];
      jest.spyOn(repository, 'find').mockResolvedValue(result as any);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('debería devolver un departamento por id', async () => {
      const id = 'some-id';
      const result = { id, nombre: 'Laboratorio', is_Active: true };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(result as any);

      expect(await service.findOne(id)).toEqual(result);
    });

    it('debería lanzar NotFoundException si el departamento no es encontrado', async () => {
      const id = 'some-id';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un departamento', async () => {
      const id = 'some-id';
      const updateDto = { nombre: 'Nuevo Nombre' };
      const existingDepto = { id, nombre: 'Laboratorio', is_Active: true };
      const updatedDepto = { ...existingDepto, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingDepto as any);
      jest.spyOn(repository, 'merge').mockReturnValue(updatedDepto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedDepto as any);

      expect(await service.update(id, updateDto)).toEqual(updatedDepto);
    });

    it('debería lanzar NotFoundException si el departamento a actualizar no es encontrado', async () => {
      const id = 'some-id';
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(id, { nombre: 'Nuevo Nombre' })).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException si los datos de actualización son inválidos', async () => {
      const id = 'some-id';
      const invalidUpdateDto = { nombre: '' }; // Simulando un nombre inválido
      const existingDepto = { id, nombre: 'Laboratorio', is_Active: true };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingDepto as any);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...existingDepto, ...invalidUpdateDto } as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new BadRequestException());

      await expect(service.update(id, invalidUpdateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('debería desactivar un departamento', async () => {
      const id = 'some-id';
      const existingDepto = { id, nombre: 'Laboratorio', is_Active: true };
      const deactivatedDepto = { ...existingDepto, is_Active: false };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingDepto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(deactivatedDepto as any);

      expect(await service.remove(id)).toEqual('Departamento desactivado exitosamente');
    });

    it('debería lanzar NotFoundException si el departamento a desactivar no es encontrado', async () => {
      const id = 'some-id';
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
