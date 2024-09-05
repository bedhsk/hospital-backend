import { Test, TestingModule } from '@nestjs/testing';
import { IndiceInsumosService } from './indice_insumos.service';

describe('IndiceInsumosService', () => {
  let service: IndiceInsumosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndiceInsumosService],
    }).compile();

    service = module.get<IndiceInsumosService>(IndiceInsumosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
