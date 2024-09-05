import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoInsumosController } from './movimiento_insumos.controller';

describe('MovimientoInsumosController', () => {
  let controller: MovimientoInsumosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientoInsumosController],
    }).compile();

    controller = module.get<MovimientoInsumosController>(MovimientoInsumosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
