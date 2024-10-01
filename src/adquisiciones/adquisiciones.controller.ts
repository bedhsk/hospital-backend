import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdquisicionesService } from './adquisiciones.service';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import CreateAdquisicionDto from './dtos/create-adquisicion.dto';
import UpdateAdquisicionDto from './dtos/update-adquisicion.dto';

@Controller('adquisiciones')
export class AdquisicionesController {
  constructor(
    private readonly adquisicionService: AdquisicionesService,
  ) {}

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear nueva adquisicion',
    description: 'Este endpoint sirve para crear nuevas adquisiciones',
  })
  @ApiBody({
    description: 'Datos de la adquisición a crear',
    schema: {
      type: 'object',
      properties: {
        usuarioId: {
          type: 'string',
          example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
        },
        descripcion: {
          type: 'string',
          example: 'Prueba de adquisicion',
        },
        insumoDepartamentoId: {
          type: 'string',
          example: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
        },
        cantidad: {
          type: 'number',
          example: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'La adquisición y el detalle han sido creados exitosamente',
    schema: {
      type: 'object',
      properties: {
        adquisicion: {
          type: 'object',
          properties: {
            descripcion: {
              type: 'string',
              example: 'Prueba de adquisicion',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
            usuario: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
                },
                username: {
                  type: 'string',
                  example: 'Admin',
                },
              },
            },
            id: {
              type: 'string',
              example: 'c33f4205-3eeb-435f-b3c9-ec056f170275',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-10-01T01:46:28.654Z',
            },
          },
        },
        detalleAdquisicion: {
          type: 'object',
          properties: {
            is_active: {
              type: 'boolean',
              example: true,
            },
            cantidad: {
              type: 'number',
              example: 10,
            },
            adquisicion: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'c33f4205-3eeb-435f-b3c9-ec056f170275',
                },
              },
            },
            insumoDepartamento: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
                },
                existencia: {
                  type: 'number',
                  example: 210,
                },
              },
            },
            id: {
              type: 'string',
              example: '052770b9-97c9-460f-9240-7364661373dc',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, revisa los campos enviados',
  })
  create(@Body() createAdquisicionDto: CreateAdquisicionDto) {
    return this.adquisicionService.create(createAdquisicionDto);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Obtiene todas las adquisiciones',
    description:
      'Este endpoint sirve para retornar todos los insumos activos en la base de datos.',
  })/*
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
  })*/
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
  /*
  findAll(@Query() query: QueryInsumoDto) {
    return this.insumosService.findAll(query);
  }*/
  findAll() {
    return this.adquisicionService.findAll();
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar una adquisicion por ID',
    description:
      'Este endpoint sirve para buscar una adquisicion por su ID, si está activo',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la adquisicion a buscar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la adquisicion activa',
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
    return this.adquisicionService.findOne(id);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Actualizar una adquisicion',
    description: 'Este endpoint sirve para actualizar una adquisicion existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la adquisicion a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Datos de la adquisicion a actualizar',
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
  update(@Param('id') id: string, @Body() updateAdquisicionDto: UpdateAdquisicionDto) {
    return this.adquisicionService.update(id, updateAdquisicionDto);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Eliminar (soft delete) una adquisicion',
    description:
      'Este endpoint sirve para eliminar una adquisicion sin borrarlo físicamente de la base de datos',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la adquisicion a eliminar',
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
    return this.adquisicionService.softDelete(id);
  }
}
