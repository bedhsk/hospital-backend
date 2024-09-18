import { Test, TestingModule } from '@nestjs/testing';
import { InsumoDepartamentosService } from './insumo_departamentos.service';

describe('InsumoDepartamentosService', () => {
  let service: InsumoDepartamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsumoDepartamentosService],
    }).compile();

    service = module.get<InsumoDepartamentosService>(InsumoDepartamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
