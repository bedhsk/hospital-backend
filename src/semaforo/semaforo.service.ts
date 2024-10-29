import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import DetalleRetiro from 'src/retiros/entities/detalleRetiro.entity';
import Retiro from 'src/retiros/entities/retiro.entity';
import { Repository } from 'typeorm';

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

@Injectable()
export class SemaforoService {
  constructor(
    @InjectRepository(Insumo)
    private insumoRepository: Repository<Insumo>,
    @InjectRepository(InsumoDepartamento)
    private insumoDepartamentoRepository: Repository<InsumoDepartamento>,
    @InjectRepository(DetalleRetiro)
    private detalleRetiroRepository: Repository<DetalleRetiro>,
    @InjectRepository(Retiro)
    private retiroRepository: Repository<Retiro>,
  ) {}

  async calculateInventoryStatus(
    diasAnalisis: number = 30,
    umbralRojo: number = 7,
    umbralAmarillo: number = 15,
  ): Promise<AleartaSemaforo[]> {
    const alerts: AleartaSemaforo[] = [];

    // Obtener todos los insumos activos
    const insumos = await this.insumoRepository.find({
      where: { is_active: true },
    });

    for (const insumo of insumos) {
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
        tiempoAgotamiento,
        umbralRojo,
        umbralAmarillo,
      );

      alerts.push({
        insumoId: insumo.id,
        nombre: insumo.nombre,
        cantidadActual,
        consumoPromedio,
        tiempoAgotamiento,
        status,
      });
    }

    return alerts;
  }

  private async getCurrentStock(insumoId: string): Promise<number> {
    // Obtener la suma de las existencias en todos los departamentos
    const result = await this.insumoDepartamentoRepository
      .createQueryBuilder('insumo_departamento')
      .select('SUM(insumo_departamento.existencia)', 'total')
      .where('insumo_departamento.insumoId = :insumoId', { insumoId })
      .andWhere('insumo_departamento.is_active = :isActive', { isActive: true })
      .getRawOne();

    return result?.total || 0;
  }

  private async calculateAverageConsumption(
    insumoId: string,
    diasAnalisis: number,
  ): Promise<number> {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - diasAnalisis);

    // Obtener todos los retiros del período para el insumo específico
    const consumoTotal = await this.detalleRetiroRepository
      .createQueryBuilder('detalleRetiro')
      .innerJoin('detalleRetiro.insumoDepartamento', 'insumoDepartamento')
      .innerJoin('detalleRetiro.retiro', 'retiro')
      .where('insumoDepartamento.insumoId = :insumoId', { insumoId })
      .andWhere('retiro.is_active = :isActive', { isActive: true })
      .andWhere('retiro.createdAt >= :fechaInicio', { fechaInicio })
      .select('SUM(detalleRetiro.cantidad)', 'total')
      .getRawOne();

    // Calcular el promedio diario
    log(consumoTotal);
    const total = Number(consumoTotal?.total) || 0;
    return total / diasAnalisis;
  }

  private determineSemaphoreStatus(
    cantidadActual: number,
    tiempoAgotamiento: number,
    umbralRojo: number,
    umbralAmarillo: number,
  ): SemaphoreStatus {
    if (cantidadActual === 0) {
      return SemaphoreStatus.OUT_OF_STOCK;
    } else if (tiempoAgotamiento <= umbralRojo) {
      return SemaphoreStatus.RED;
    } else if (tiempoAgotamiento <= umbralAmarillo) {
      return SemaphoreStatus.YELLOW;
    }
    return SemaphoreStatus.GREEN;
  }
}
