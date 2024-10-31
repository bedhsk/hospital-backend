import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AleartaSemaforoResponse, SemaforoService } from './semaforo.service';
import QuerySemaforoDto from './dtos/query-semaforo.dto';

@ApiTags('Semaforo')
@Controller('semaforo')
export class SemaforoController {
  constructor(private semaforoService: SemaforoService) {}

  @Get('insumos')
  @ApiOperation({
    summary: 'Obtiene alertas de inventario',
    description:
      'Este endpoint sirve para obtener el estado del inventario basado en ciertos parámetros.',
  })
  @ApiQuery({
    name: 'param1',
    type: String,
    required: false,
    description: 'Primer parámetro para filtrar las alertas.',
    example: 'value1',
  })
  @ApiQuery({
    name: 'param2',
    type: String,
    required: false,
    description: 'Segundo parámetro para filtrar las alertas.',
    example: 'value2',
  })
  @ApiResponse({
    status: 200,
    description: 'Alertas de inventario obtenidas exitosamente.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              insumoId: {
                type: 'string',
                example: '12345',
              },
              nombre: {
                type: 'string',
                example: 'Producto A',
              },
              cantidadActual: {
                type: 'number',
                example: 100,
              },
              consumoPromedio: {
                type: 'number',
                example: 10,
              },
              tiempoAgotamiento: {
                type: 'number',
                example: 10,
              },
              status: {
                type: 'string',
                example: 'green',
              },
            },
          },
        },
        totalItems: {
          type: 'number',
          example: 100,
        },
        totalPages: {
          type: 'number',
          example: 10,
        },
        page: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta. Parámetros inválidos.',
  })
  getInventoryAlerts(
    @Query() query: QuerySemaforoDto,
  ): Promise<AleartaSemaforoResponse> {
    return this.semaforoService.calculateInventoryStatus(query);
  }
}
