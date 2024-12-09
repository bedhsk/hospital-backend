import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import CreateRetiroDto from './dto/create-retiro.dto';
import { RetirosService } from './retiros.service';
import QueryRetiroDto from './dto/query-retiro.dto';
import UpdateRetiroDto from './dto/update-retiro.dto';
import Retiro from './entities/retiro.entity';
import { DetalleretirosService } from './detalleretiros/detalleretiros.service';
import CreateTransaccionDepartamentoDto from './dto/transaccion_departamento.dto';
import { query } from 'express';
import CreateRetiroPublicDto from './dto/create-retiro-public.dto';
import { IsPublic } from 'src/common/is-public.decorator';

@ApiTags('Retiros y detalleRetiro')
@Controller('retiros')
export class RetirosController {
  constructor(
    private readonly retiroService: RetirosService,
    private readonly detalleRetiroService: DetalleretirosService,
  ) {}

  @AuthorizedRoles([
    'Bodega',
    'Farmacia',
    'Odontologia',
    'Nutricion',
    'Medicos',
    'Enfermeria',
    'Laboratorio',
  ])
  @Post()
  @ApiBody({
    description: 'Datos de el retiro a crear',
    schema: {
      type: 'object',
      properties: {
        usuarioId: {
          type: 'string',
          example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
        },
        descripcion: {
          type: 'string',
          example: 'Prueba de retiro',
        },
        detalles: {
          type: 'array',
          example: [
            {
              insumoDepartamentoId: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
              cantidad: 10,
            },
            {
              insumoDepartamentoId: 'b93d5cc2-03c7-4f7a-8101-49c779c1234b',
              cantidad: 5,
            },
          ],
        },
      },
    },
  })
  @ApiOperation({ summary: 'Crear un nuevo retiro' })
  @ApiResponse({
    status: 201,
    description: 'el retiro y el detalle han sido creados exitosamente',
    schema: {
      type: 'object',
      properties: {
        retiro: {
          type: 'object',
          properties: {
            descripcion: {
              type: 'string',
              example: 'Prueba de retiro',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
            user: {
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
              type: 'Date',
              example: '2024-08-29T01:38:11.779Z',
            },
          },
        },
        detalleRetiro: {
          type: 'array',
          example: [
            {
              is_active: true,
              cantidad: 10,
              retiro: {
                id: 'c33f4205-3eeb-435f-b3c9-ec056f170275',
              },
              insumoDepartamento: {
                id: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
                existencia: 210,
              },
              id: '052770b9-97c9-460f-9240-7364661373dc',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o insumo departamento no encontrado.',
  })
  create(@Body() createRetiroDto: CreateRetiroPublicDto) {
    return this.retiroService.createPublic(createRetiroDto);
  }

  @IsPublic()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retiro con su detalle y departamento obtenidas exitosamente.',
    schema: {
      type: 'object',
      properties: {
        retiro: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'bdda2e12-acae-4c14-8ca3-f009715a2012',
                description: 'ID del Retiro',
              },
              createdAt: {
                type: 'date',
                format: 'date-time',
                example: '2024-08-29T01:38:11.779Z',
                description: 'Fecha de creación del Retiro',
              },
              descripcion: {
                type: 'string',
                example: 'Prueba de actualización',
                description: 'Descripción Retiro',
              },
              user: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
                    description: 'ID del usuario',
                  },
                  username: {
                    type: 'string',
                    example: 'Admin',
                    description: 'Nombre de usuario del responsable del Retiro',
                  },
                },
              },
              detalleRetiro: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: '18198df1-8a64-409c-9acb-1432cc173864',
                      description: 'ID del detalle de retirada',
                    },
                    nombreInsumo: {
                      type: 'string',
                      example: 'Insumo A',
                      description: 'Nombre del insumo',
                    },
                    cantidad: {
                      type: 'number',
                      example: 20,
                      description: 'Cantidad adquirida del insumo',
                    },
                  },
                },
              },
            },
          },
        },
        totalItems: {
          type: 'number',
          example: 1,
          description: 'Número total de Retiros',
        },
        totalPages: {
          type: 'number',
          example: 1,
          description: 'Número total de páginas',
        },
        page: {
          type: 'number',
          example: 1,
          description: 'Página actual de los resultados',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Obtener todos los retiros' })
  @ApiResponse({ status: 200, description: 'Lista de retiros' })
  @ApiQuery({
    name: 'filterUser',
    required: false,
    description: 'Filtrar por nombre de usuario',
  })
  @ApiQuery({
    name: 'filterDepartamento',
    required: false,
    description: 'Filtrar por nombre de departamento',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página para paginación',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de elementos por página',
    type: Number,
  })
  findAll(@Query() query: QueryRetiroDto) {
    return this.retiroService.findAll(query);
  }

  @IsPublic()
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Detalles de el retiro activo',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'bdda2e12-acae-4c14-8ca3-f009715a2012',
          description: 'ID del retiro',
        },
        createdAt: {
          type: 'Date',
          format: 'date-time',
          example: '2024-10-01T05:19:07.624Z',
          description: 'Fecha de creación del retiro',
        },
        descripcion: {
          type: 'string',
          example: 'Prueba de actualización',
          description: 'Descripción del retiro',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
              description: 'ID del usuario',
            },
            username: {
              type: 'string',
              example: 'Admin',
              description: 'Nombre de usuario del responsable del retiro',
            },
          },
        },
        detalleRetiro: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '18198df1-8a64-409c-9acb-1432cc173864',
                description: 'ID del detalle de retiro',
              },
              nombreInsumo: {
                type: 'string',
                example: 'Insumo A',
                description: 'Nombre del insumo',
              },
              cantidad: {
                type: 'number',
                example: 20,
                description: 'Cantidad adquirida del insumo',
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Obtener un retiro por ID' })
  @ApiResponse({ status: 200, description: 'Retiro encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Retiro no encontrado o desactivado.',
  })
  @ApiParam({ name: 'id', description: 'ID del retiro' })
  findOneOut(@Param('id') id: string) {
    return this.retiroService.findOnePublic(id);
  }

  @AuthorizedRoles([
    'Bodega',
    'Farmacia',
    'Odontologia',
    'Nutricion',
    'Medicos',
    'Enfermeria',
    'Laboratorio',
  ])
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un retiro existente' })
  @ApiBody({
    description: 'Datos de el retiro a actualizar',
    schema: {
      type: 'object',
      properties: {
        descripcion: {
          type: 'string',
          example: 'Descripcion de prueba',
        },
        detalles: {
          type: 'array',
          example: [
            {
              insumoDepartamentoId: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
              cantidad: 20,
            },
          ],
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
        retiro: {
          type: 'object',
          properties: {
            descripcion: {
              type: 'string',
              example: 'Prueba de retiro',
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
        detalleRetiro: {
          type: 'array',
          example: [
            {
              is_active: true,
              cantidad: 20,
              retiro: {
                id: 'c33f4205-3eeb-435f-b3c9-ec056f170275',
              },
              insumoDepartamento: {
                id: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
                existencia: 220,
              },
              id: '052770b9-97c9-460f-9240-7364661373dc',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Retiro no encontrado o desactivado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del retiro',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  update(@Param('id') id: string, @Body() updateRetiroDto: UpdateRetiroDto) {
    return this.retiroService.update(id, updateRetiroDto);
  }

  @AuthorizedRoles([
    'Bodega',
    'Farmacia',
    'Odontologia',
    'Nutricion',
    'Medicos',
    'Enfermeria',
    'Laboratorio',
  ])
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un retiro (soft delete)' })
  @ApiResponse({ status: 200, description: 'Retiro desactivado' })
  @ApiResponse({
    status: 404,
    description: 'Retiro no encontrado o ya desactivado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del retiro',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  remove(@Param('id') id: string) {
    return this.retiroService.softDelete(id);
  }

  @IsPublic()
  @ApiParam({
    name: 'id',
    type: 'string',
    description:
      'ID del retiro que se desea encontrar todos sus detalles reirosr',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get('/:id/detalles-de-retiro')
  findAllDetallesByRetiroId(@Param('id') id: string) {
    return this.detalleRetiroService.findAllRetiroId(id);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Obtener todos los retiros por departamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de retiros por departamento',
  })
  @ApiQuery({
    name: 'filterUser',
    required: false,
    description: 'Filtrar por nombre de usuario',
  })
  @ApiQuery({
    name: 'filterDepartamento',
    required: false,
    description: 'Filtrar por nombre de departamento',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para paginación',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de elementos por página',
  })
  @Get('/depto/list')
  async findAllInDepartamento(@Query() query: QueryRetiroDto) {
    return await this.retiroService.findAllInDepartamento(query);
  }

  @AuthorizedRoles(['Farmacia', 'Bodega'])
  @Post('/transaccion')
  @ApiResponse({
    status: 404,
    description: 'Usuario o insumo departamento no encontrado.',
  })
  createTrans(@Body() createTransDto: CreateTransaccionDepartamentoDto) {
    return this.retiroService.transaccionDepartamento(createTransDto);
  }
}
