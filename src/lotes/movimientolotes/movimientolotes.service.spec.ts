import { Test, TestingModule } from '@nestjs/testing';
import { MovimientolotesService } from './movimientolotes.service';

describe('MovimientolotesService', () => {
  let service: MovimientolotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimientolotesService],
    }).compile();

    service = module.get<MovimientolotesService>(MovimientolotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
