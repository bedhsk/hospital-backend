import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoInsumosService } from './movimiento_insumos.service';

describe('MovimientoInsumosService', () => {
  let service: MovimientoInsumosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimientoInsumosService],
    }).compile();

    service = module.get<MovimientoInsumosService>(MovimientoInsumosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
