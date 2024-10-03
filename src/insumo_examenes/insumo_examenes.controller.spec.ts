import { Test, TestingModule } from '@nestjs/testing';
import { InsumoExamenesController } from './insumo_examenes.controller';

describe('InsumoExamenesController', () => {
  let controller: InsumoExamenesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsumoExamenesController],
    }).compile();

    controller = module.get<InsumoExamenesController>(InsumoExamenesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
