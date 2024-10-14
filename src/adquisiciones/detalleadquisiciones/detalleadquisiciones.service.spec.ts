import { Test, TestingModule } from '@nestjs/testing';
import { DetalleadquisicionesService } from './detalleadquisiciones.service';

describe('DetalleadquisicionesService', () => {
  let service: DetalleadquisicionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleadquisicionesService],
    }).compile();

    service = module.get<DetalleadquisicionesService>(DetalleadquisicionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
