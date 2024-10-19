import { Test, TestingModule } from '@nestjs/testing';
import { OrdenLaboratoriosController } from './orden_laboratorios.controller';


describe('OrdenLaboratoriosController', () => {
  let controller: OrdenLaboratoriosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenLaboratoriosController],
    }).compile();

    controller = module.get<OrdenLaboratoriosController>(OrdenLaboratoriosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
