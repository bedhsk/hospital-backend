import { Test, TestingModule } from '@nestjs/testing';
import { InsumoDepartamentosController } from './insumo_departamentos.controller';

describe('InsumoDepartamentosController', () => {
  let controller: InsumoDepartamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsumoDepartamentosController],
    }).compile();

    controller = module.get<InsumoDepartamentosController>(InsumoDepartamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
