import { Test, TestingModule } from '@nestjs/testing';
import { IndiceMedicamentosController } from './indice_medicamentos.controller';

describe('IndiceMedicamentosController', () => {
  let controller: IndiceMedicamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndiceMedicamentosController],
    }).compile();

    controller = module.get<IndiceMedicamentosController>(IndiceMedicamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
