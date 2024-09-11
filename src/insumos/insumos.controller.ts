import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InsumosService } from './insumos.service';
import CreateInsumoDto from './dtos/create-insumo.dto';
import UpdateInsumoDto from './dtos/update-insumo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';

@ApiTags('Insumos')
@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) { }

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
    summary: 'Listar insumos',
    description: 'Este endpoint sirve para listar todos los insumos activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de insumos activos',
    schema: {
      type: 'array',
      items: {
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
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findAll() {
    return this.insumosService.findAll();
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar un insumo por ID',
    description: 'Este endpoint sirve para buscar un insumo por su ID, si está activo',
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
    description: 'Este endpoint sirve para eliminar un insumo sin borrarlo físicamente de la base de datos',
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
