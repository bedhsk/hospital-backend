import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import { InsumosService } from 'src/insumos/insumos.service';
import { DetalleretirosService } from 'src/retiros/detalleretiros/detalleretiros.service';
import QuerySemaforoDto from './dtos/query-semaforo.dto';

export enum SemaphoreStatus {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  OUT_OF_STOCK = 'out-of-stock',
}

export interface AleartaSemaforo {
  insumoId: string;
  nombre: string;
  cantidadActual: number;
  consumoPromedio: number;
  tiempoAgotamiento: number; // en días
  status: SemaphoreStatus;
}

export interface AleartaSemaforoResponse {
  data: AleartaSemaforo[];
  totalItems: number;
  totalPages: number;
  page: number;
}

@Injectable()
export class SemaforoService {
  constructor(
    private readonly insumoService: InsumosService,
    private readonly insumoDepartamentoService: InsumoDepartamentosService,
    private readonly detalleRetiroService: DetalleretirosService,
  ) {}

  async calculateInventoryStatus(
    queryDto: QuerySemaforoDto,
    diasAnalisis: number = 30,
    umbralRojo: number = 7,
    umbralAmarillo: number = 15,
  ): Promise<AleartaSemaforoResponse> {
    const alerts: AleartaSemaforo[] = [];

    // Obtener todos los insumos activos
    const insumos = await this.insumoService.findActive(queryDto);

    for (const insumo of insumos.data) {
      // Obtener la cantidad actual total del insumo
      const cantidadActual = await this.getCurrentStock(insumo.id);

      // Calcular el consumo promedio diario
      const consumoPromedio = await this.calculateAverageConsumption(
        insumo.id,
        diasAnalisis,
      );

      // Calcular tiempo hasta agotamiento en días
      let tiempoAgotamiento: number;
      if (consumoPromedio > 0) {
        tiempoAgotamiento = Math.floor(cantidadActual / consumoPromedio);
      } else {
        // Si el consumo promedio es cero, se considera que el insumo está agotado
        tiempoAgotamiento = 0;
      }

      // Determinar el estado del semáforo
      const status = this.determineSemaphoreStatus(
        cantidadActual,
        consumoPromedio,
        tiempoAgotamiento,
        umbralRojo,
        umbralAmarillo,
      );

      alerts.push({
        insumoId: insumo.id,
        nombre: insumo.nombre,
        cantidadActual,
        consumoPromedio,
        tiempoAgotamiento:
          tiempoAgotamiento === Number.POSITIVE_INFINITY
            ? -1
            : tiempoAgotamiento,
        status,
      });
    }

    return {
      data: alerts,
      totalItems: insumos.totalItems,
      totalPages: insumos.totalPages,
      page: insumos.page,
    };
  }

  private async getCurrentStock(insumoId: string): Promise<number> {
    // Obtener la suma de las existencias en todos los departamentos
    const result = await this.insumoDepartamentoService.getStock(insumoId);

    return result?.total || 0;
  }

  private async calculateAverageConsumption(
    insumoId: string,
    diasAnalisis: number,
  ): Promise<number> {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - diasAnalisis);

    // Obtener todos los retiros del período para el insumo específico
    const consumoTotal = await this.detalleRetiroService.getConsumoTotal(
      insumoId,
      fechaInicio,
    );

    // Calcular el promedio diario
    // log(consumoTotal);
    const total = Number(consumoTotal?.total) || 0;
    return parseFloat((total / diasAnalisis).toFixed(2));
  }

  private determineSemaphoreStatus(
    cantidadActual: number,
    consumoPromedio: number,
    tiempoAgotamiento: number,
    umbralRojo: number,
    umbralAmarillo: number,
  ): SemaphoreStatus {
    if (cantidadActual === 0) {
      return SemaphoreStatus.OUT_OF_STOCK;
    }

    // Si no hay consumo (consumoPromedio = 0) pero hay existencias, el estado es verde
    if (consumoPromedio === 0 && cantidadActual > 0) {
      return SemaphoreStatus.GREEN;
    }

    // Evaluación normal basada en el tiempo de agotamiento
    if (tiempoAgotamiento <= umbralRojo) {
      return SemaphoreStatus.RED;
    } else if (tiempoAgotamiento <= umbralAmarillo) {
      return SemaphoreStatus.YELLOW;
    }
    return SemaphoreStatus.GREEN;
  }
}
