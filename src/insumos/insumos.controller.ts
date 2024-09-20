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
import { InsumosService } from './insumos.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import UpdateInsumoDto from './dto/update-insumo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryInsumoDto from './dto/query-insumo.dto';

@ApiTags('Insumos')
@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo insumo',
    description: 'Este endpoint sirve para crear nuevos insumos',
  })
  @ApiResponse({
    status: 201,
    description: 'El insumo ha sido creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        categoriaId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        codigo: {
          type: 'string',
          example: 'INS-001',
        },
        nombre: {
          type: 'string',
          example: 'Insumo X',
        },
        trazador: {
          type: 'boolean',
          example: false,
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
  create(@Body() createInsumoDto: CreateInsumoDto) {
    return this.insumosService.create(createInsumoDto);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los insumos',
    description:
      'Este endpoint sirve para retornar todos los insumos activos en la base de datos.',
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
    description: 'Filtro por categoría del insumo.',
    example: 'Categoria Y',
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
    description: 'Insumos obtenidos exitosamente.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174001',
          },
          nombre: { type: 'string', example: 'Insumo X' },
          codigo: { type: 'string', example: 'INS-001' },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll(@Query() query: QueryInsumoDto) {
    return this.insumosService.findAll(query);
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar un insumo por ID',
    description:
      'Este endpoint sirve para buscar un insumo por su ID, si está activo',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del insumo a buscar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del insumo activo',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        categoriaId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        codigo: {
          type: 'string',
          example: 'INS-001',
        },
        nombre: {
          type: 'string',
          example: 'Insumo X',
        },
        trazador: {
          type: 'boolean',
          example: false,
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
    description: 'Insumo no encontrado o desactivado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findOne(@Param('id') id: string) {
    return this.insumosService.findOne(id);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Actualizar un insumo',
    description: 'Este endpoint sirve para actualizar un insumo existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del insumo a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Datos del insumo a actualizar',
    schema: {
      type: 'object',
      properties: {
        categoriaId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        codigo: {
          type: 'string',
          example: 'INS-001',
        },
        nombre: {
          type: 'string',
          example: 'Insumo X',
        },
        trazador: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'El insumo ha sido actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        categoriaId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        codigo: {
          type: 'string',
          example: 'INS-001',
        },
        nombre: {
          type: 'string',
          example: 'Insumo X',
        },
        trazador: {
          type: 'boolean',
          example: false,
        },
        is_active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsumoDto: UpdateInsumoDto) {
    return this.insumosService.update(id, updateInsumoDto);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Eliminar (soft delete) un insumo',
    description:
      'Este endpoint sirve para eliminar un insumo sin borrarlo físicamente de la base de datos',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del insumo a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Insumo desactivado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Insumo no encontrado o ya desactivado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insumosService.softDelete(id);
  }
}
