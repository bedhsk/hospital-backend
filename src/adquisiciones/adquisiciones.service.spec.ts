import { Test, TestingModule } from '@nestjs/testing';
import { AdquisicionesService } from './adquisiciones.service';

describe('AdquisicionesService', () => {
  let service: AdquisicionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdquisicionesService],
    }).compile();

    service = module.get<AdquisicionesService>(AdquisicionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
