import { Test, TestingModule } from '@nestjs/testing';
import { IndiceInsumosController } from './indice_insumos.controller';

describe('IndiceInsumosController', () => {
  let controller: IndiceInsumosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndiceInsumosController],
    }).compile();

    controller = module.get<IndiceInsumosController>(IndiceInsumosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
