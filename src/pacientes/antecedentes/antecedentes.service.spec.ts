import { Test, TestingModule } from '@nestjs/testing';
import { AntecedentesService } from './antecedentes.service';

describe('AntecedentesService', () => {
  let service: AntecedentesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntecedentesService],
    }).compile();

    service = module.get<AntecedentesService>(AntecedentesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
