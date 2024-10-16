import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Retiro from './entities/retiro.entity';
import { Repository } from 'typeorm';
import { DetalleretirosService } from './detalleretiros/detalleretiros.service';
import { UsersService } from 'src/users/users.service';
import { InsumoDepartamentosService } from 'src/insumo_departamentos/insumo_departamentos.service';
import QueryRetiroDto from './dto/query-retiro.dto';
import CreateRetiroDto from './dto/create-retiro.dto';
import UpdateRetiroDto from './dto/update-retiro.dto';

@Injectable()
export class RetirosService {
    constructor(
        @InjectRepository(Retiro)
        private readonly retiroRepository: Repository<Retiro>,
        private readonly detalleRetiroService: DetalleretirosService,
        private readonly usuarioService: UsersService,
        private readonly insumoDepartamentoService: InsumoDepartamentosService,
      ) {}

      async findAll(query: QueryRetiroDto) {
        const { filterUser, filterDepartamento, page, limit } = query;
        const queryBuilder = this.retiroRepository
          .createQueryBuilder('retiro')
          .leftJoinAndSelect('retiro.user', 'user')
          .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
          .leftJoinAndSelect('detalleRetiro.insumoDepartamento', 'insumoDepartamento')
          .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
          .where('retiro.is_active = true')
          .select([
            'retiro', // Todos los campos de adquisicion
            'user.id', 'user.username', // Solo ID y username del usuario
            'detalleRetiro.id', 'detalleRetiro.cantidad', // Solo ID y cantidad del detalle de reitro
            'insumoDepartamento.id', 'insumoDepartamento.existencia', // Solo ID y existencia y nombre del insumoDepartamento
            'departamento.id', 'departamento.nombre', // Id y nombre del departamento.
          ])
    
        if (filterUser) {
          queryBuilder.andWhere('user.username ILIKE :username', { username: `%${filterUser}%` });
        }
    
        if (filterDepartamento) {
          queryBuilder.andWhere('departamento.nombre = :departamento', {
            departamento: `${filterDepartamento}`,
          });
        }
    
        const totalItems = await queryBuilder.getCount();
        const insumos = await queryBuilder
          .skip((page - 1) * limit)
          .take(limit)
          .getMany();
    
        const totalPages = Math.ceil(totalItems / limit);
    
        return {
          data: insumos,
          totalItems,
          totalPages,
          page,
        };
      }


      async findOne(id: string) {
        const retiro = await this.retiroRepository
          .createQueryBuilder('retiro')
          .leftJoinAndSelect('retiro.user', 'user')
          .leftJoinAndSelect('retiro.detalleRetiro', 'detalleRetiro')
          .leftJoinAndSelect('detalleRetiro.insumoDepartamento', 'insumoDepartamento')
          .leftJoinAndSelect('insumoDepartamento.departamento', 'departamento')
          .where('retiro.id = :id', { id })
          .andWhere('retiro.is_active = true')
          .select([
            'retiro', // Todos los campos de adquisicion
            'user.id', 'user.username', // Solo ID y username del usuario
            'detalleRetiro.id', 'detalleRetiro.cantidad', // Solo ID y cantidad del detalle de adquisición
            'insumoDepartamento.id', 'insumoDepartamento.existencia', // Solo ID y existencia y nombre del insumoDepartamento
            'departamento.id', 'departamento.nombre', // Id y nombre del departamento.
          ])
          .getOne();
      
        if (!retiro) {
          throw new NotFoundException(
            `Retiro con ID ${id} no encontrada o desactivada`,
          );
        }
      
        return retiro;
      }

      async create(createRetiro: CreateRetiroDto) {
        const { usuarioId, insumoDepartamentoId, ...rest } = createRetiro;
        const usuario = await this.usuarioService.findOne(
            createRetiro.usuarioId,
        );
    
        if (!usuario) {
          throw new NotFoundException(
            `Usuario con id ${usuarioId} no encontrado`,
          );
        }
    
        const insumoDepartamento = await this.insumoDepartamentoService.findOne(
            createRetiro.insumoDepartamentoId,
        );
    
        if (!insumoDepartamento) {
          throw new NotFoundException(
            `Insumo departamento con id ${insumoDepartamentoId} no encontrado`,
          );
        }
 
        const retiroCreate = this.retiroRepository.create({
          ...rest,
          user: {id: usuario.id, username: usuario.username}, 
        });
      
        const retiro = await this.retiroRepository.save(retiroCreate)
    
        if (!retiro) {
          throw new NotFoundException(
            `Retiro no fue creada con exito!`,
          );
        }
        
        if (retiro) {
          // Actualizar la existencia del insumo departamento
          await this.insumoDepartamentoService.update(
            insumoDepartamento.id,
            {
              existencia: insumoDepartamento.existencia - createRetiro.cantidad 
            }
          );
        }
        // Crear el detalle con la cantidad y insumo departamento relacionado
        const detalleARetiro = await this.detalleRetiroService.create({
          retiroId: retiro.id,
          insumoDepartamentoId: insumoDepartamentoId,
          cantidad: createRetiro.cantidad,
        })
    
        return {retiro, detalleARetiro};
      }
    

      async update(id: string, updateRetiro: UpdateRetiroDto) {
        const retiro = await this.findOne(id);
        if (!retiro) {
          throw new NotFoundException(
            `Retiro con ID ${id} no encontrado o desactivado`,
          );
        }
        if(updateRetiro.descripcion){
          this.retiroRepository.merge(retiro, {descripcion: updateRetiro.descripcion});
        }
        if(updateRetiro.cantidad){
          const detalleRetiroAux = await this.detalleRetiroService.findOneByRetiroId(id)
          await this.detalleRetiroService.update(detalleRetiroAux.id, {cantidad: updateRetiro.cantidad})
        }
        return await this.retiroRepository.save(retiro);
      }
      
      async softDelete(id: string) {
        const retiroAux = await this.findOne(id);
        if (!retiroAux) {
          throw new NotFoundException(
            `Retiro con ID ${id} no encontrado o ya desactivado`,
          );
        }
        // Cambiamos el campo is_active a false para realizar el soft delete
        retiroAux.is_active = false;
        const retiro = await this.retiroRepository.save(retiroAux);
    
        const detalleRetiroAux = await this.detalleRetiroService.findOneByRetiroId(id)
        if(detalleRetiroAux){
          const insumoDepartamento = await this.insumoDepartamentoService.findOne(detalleRetiroAux.insumoDepartamento.id)
          // Actualizar la existencia del insumo departamento
          await this.insumoDepartamentoService.update(
            insumoDepartamento.id,
            {
              existencia: insumoDepartamento.existencia + detalleRetiroAux.cantidad
            }
          );
        }
        const detalleAdquisicion = await this.detalleRetiroService.softDelete(detalleRetiroAux.id)
        return {retiro, detalleAdquisicion}
      }
}
