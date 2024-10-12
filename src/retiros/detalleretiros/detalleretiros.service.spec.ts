import { Test, TestingModule } from '@nestjs/testing';
import { DetalleretirosService } from './detalleretiros.service';

describe('DetalleretirosService', () => {
  let service: DetalleretirosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleretirosService],
    }).compile();

    service = module.get<DetalleretirosService>(DetalleretirosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
