import { Controller, Get, Query } from '@nestjs/common';
import { AleartaSemaforoResponse, SemaforoService } from './semaforo.service';
import QuerySemaforoDto from './dtos/query-semaforo.dto';

@Controller('semaforo')
export class SemaforoController {
  constructor(private semaforoService: SemaforoService) {}

  @Get('alerts')
  getInventoryAlerts(
    @Query() query: QuerySemaforoDto,
  ): Promise<AleartaSemaforoResponse> {
    return this.semaforoService.calculateInventoryStatus(query);
  }
}
