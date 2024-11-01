import { Test, TestingModule } from '@nestjs/testing';
import { SemaforoService } from './semaforo.service';

describe('SemaforoService', () => {
  let service: SemaforoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemaforoService],
    }).compile();

    service = module.get<SemaforoService>(SemaforoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
