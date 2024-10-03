import { Test, TestingModule } from '@nestjs/testing';
import { OrdenLaboratoriosService } from './orden_laboratorios.service';

describe('OrdenLaboratoriosService', () => {
  let service: OrdenLaboratoriosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenLaboratoriosService],
    }).compile();

    service = module.get<OrdenLaboratoriosService>(OrdenLaboratoriosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
