import { Test, TestingModule } from '@nestjs/testing';
import { ExamenesController } from './examenes.controller';

describe('ExamenesController', () => {
  let controller: ExamenesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamenesController],
    }).compile();

    controller = module.get<ExamenesController>(ExamenesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
