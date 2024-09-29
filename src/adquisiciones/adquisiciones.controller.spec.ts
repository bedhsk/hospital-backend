import { Test, TestingModule } from '@nestjs/testing';
import { AdquisicionesController } from './adquisiciones.controller';

describe('AdquisicionesController', () => {
  let controller: AdquisicionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdquisicionesController],
    }).compile();

    controller = module.get<AdquisicionesController>(AdquisicionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
