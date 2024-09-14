import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InsumoDepartamentoService } from './insumo_departamentos.service';
import CreateInsumoDepartamentoDto from './dtos/create-insumo_departamento.dto';
import UpdateInsumoDepartamentoDto from './dtos/update-insumo_departamento.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryIsumoDepartamentoDto from './dtos/query-insumo_departamento.dto';

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
    summary: 'Obtiene todos los insumos departamento',
    description: 'Este endpoint sirve para retornar todos los insumos por departamento en la base de datos.',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
    description: 'Nombre del insumo para filtrar.',
    example: 'Insumo X',
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
    description: 'Nombre del departamento para filtrar.',
    example: 'Departamento A',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Número de página actual para la paginación.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Número de elementos por página para la paginación.',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Insumos por departamento obtenidos exitosamente.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
          existencia: { type: 'number', example: 150 },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll(@Query() query: QueryIsumoDepartamentoDto) {
    return this.insumoDepartamentoService.findAll(query);
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
