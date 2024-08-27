import { Test, TestingModule } from '@nestjs/testing';
import { IndiceMedicamentosService } from './indice_medicamentos.service';

describe('IndiceMedicamentosService', () => {
  let service: IndiceMedicamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndiceMedicamentosService],
    }).compile();

    service = module.get<IndiceMedicamentosService>(IndiceMedicamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
