import { Test, TestingModule } from '@nestjs/testing';
import { InsumoExamenesService } from './insumo_examenes.service';

describe('InsumoExamenesService', () => {
  let service: InsumoExamenesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsumoExamenesService],
    }).compile();

    service = module.get<InsumoExamenesService>(InsumoExamenesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
