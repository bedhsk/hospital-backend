import { Controller, Get } from '@nestjs/common';
import { AleartaSemaforo, SemaforoService } from './semaforo.service';

@Controller('semaforo')
export class SemaforoController {
  constructor(private semaforoService: SemaforoService) {}

  @Get('alerts')
  getInventoryAlerts(): Promise<AleartaSemaforo[]> {
    return this.semaforoService.calculateInventoryStatus();
  }
}
