import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InsumoDepartamentoService } from './insumo_departamentos.service';
import CreateInsumoDepartamentoDto from './dtos/create-insumo_departamento.dto';
import UpdateInsumoDepartamentoDto from './dtos/update-insumo_departamento.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';

@ApiTags('InsumoDepartamento')
@Controller('insumo-departamento')
export class InsumoDepartamentoController {
  constructor(private readonly insumoDepartamentoService: InsumoDepartamentoService) { }

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear una relación de insumo con departamento',
    description: 'Este endpoint sirve para crear una nueva relación entre insumo y departamento',
  })
  @ApiResponse({
    status: 201,
    description: 'La relación insumo-departamento ha sido creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        insumoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        departamentoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        existencia: {
          type: 'number',
          example: 100,
        },
        is_active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, revisa los campos enviados',
  })
  create(@Body() createInsumoDepartamentoDto: CreateInsumoDepartamentoDto) {
    return this.insumoDepartamentoService.create(createInsumoDepartamentoDto);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Listar todas las relaciones insumo-departamento',
    description: 'Este endpoint sirve para listar todas las relaciones insumo-departamento activas',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de relaciones activas entre insumo y departamento',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          insumoId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          departamentoId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174001',
          },
          existencia: {
            type: 'number',
            example: 100,
          },
          is_active: {
            type: 'boolean',
            example: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findAll() {
    return this.insumoDepartamentoService.findAll();
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar una relación insumo-departamento',
    description: 'Este endpoint sirve para buscar una relación insumo-departamento por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la relación insumo-departamento a buscar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la relación insumo-departamento',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        insumoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        departamentoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        existencia: {
          type: 'number',
          example: 100,
        },
        is_active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Relación insumo-departamento no encontrada',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findOne(@Param('id') id: string) {
    return this.insumoDepartamentoService.findOne(id);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Actualizar una relación insumo-departamento',
    description: 'Este endpoint sirve para actualizar una relación insumo-departamento existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la relación insumo-departamento a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Datos de la relación a actualizar',
    schema: {
      type: 'object',
      properties: {
        existencia: {
          type: 'number',
          example: 200,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'La relación insumo-departamento ha sido actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        insumoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        departamentoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        existencia: {
          type: 'number',
          example: 200,
        },
        is_active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsumoDepartamentoDto: UpdateInsumoDepartamentoDto) {
    return this.insumoDepartamentoService.update(id, updateInsumoDepartamentoDto);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Eliminar (soft delete) una relación insumo-departamento',
    description: 'Este endpoint sirve para eliminar (soft delete) una relación insumo-departamento',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la relación insumo-departamento a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'La relación insumo-departamento ha sido desactivada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación insumo-departamento no encontrada',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insumoDepartamentoService.softDelete(id);
  }
}
