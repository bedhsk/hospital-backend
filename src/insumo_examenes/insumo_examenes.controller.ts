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
import { InsumoExamenesService } from './insumo_examenes.service';
import CreateInsumoExamenDto from './dtos/create-insumo_examen.dto';
import UpdateInsumoExamenDto from './dtos/update-insumo_examen.dto';
import QueryInsumoExamenDto from './dtos/query-insumo_examen.dto';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';

@ApiTags('Insumo-Examenes')
@Controller('insumo-examenes')
export class InsumoExamenesController {
  constructor(private readonly insumoExamenesService: InsumoExamenesService) {}

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo Insumo-Examen',
    description: 'Este endpoint crea un nuevo Insumo-Examen en la base de datos',
  })
  @ApiResponse({
    status: 201,
    description: 'El Insumo-Examen ha sido creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        cantidad: {
          type: 'number',
          example: 50,
        },
        insumoId: {
          type: 'string',
          example: '068497fc-4c83-42cf-bef5-20775f8db4ae',
        },
        examenId: {
          type: 'string',
          example: '6987a4a6-3cbb-4854-9e22-e7055f37771d',
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
  create(@Body() createInsumoExamenDto: CreateInsumoExamenDto) {
    return this.insumoExamenesService.create(createInsumoExamenDto);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los Insumo-Examenes',
    description: 'Este endpoint retorna todos los Insumo-Examenes activos en la base de datos',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
    description: 'Consulta para filtrar por cantidad',
    example: '50',
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
    description: 'Filtro por ID de examen',
    example: '6987a4a6-3cbb-4854-9e22-e7055f37771d',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Número de página actual para la paginación',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Número de elementos por página para la paginación',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Insumo-Examenes obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          cantidad: {
            type: 'number',
            example: 50,
          },
          insumoId: {
            type: 'string',
            example: '068497fc-4c83-42cf-bef5-20775f8db4ae',
          },
          examenId: {
            type: 'string',
            example: '6987a4a6-3cbb-4854-9e22-e7055f37771d',
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
  findAll(@Query() query: QueryInsumoExamenDto) {
    return this.insumoExamenesService.findAll(query);
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar un Insumo-Examen por ID',
    description: 'Este endpoint busca un Insumo-Examen activo por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del Insumo-Examen a buscar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del Insumo-Examen encontrado',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        cantidad: {
          type: 'number',
          example: 50,
        },
        insumoId: {
          type: 'string',
          example: '068497fc-4c83-42cf-bef5-20775f8db4ae',
        },
        examenId: {
          type: 'string',
          example: '6987a4a6-3cbb-4854-9e22-e7055f37771d',
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
    description: 'Insumo-Examen no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.insumoExamenesService.findOne(id);
  }

  @AuthorizedRoles()
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un Insumo-Examen existente',
    description: 'Este endpoint actualiza un Insumo-Examen existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del Insumo-Examen a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Datos del Insumo-Examen a actualizar',
    schema: {
      type: 'object',
      properties: {
        cantidad: {
          type: 'number',
          example: 100,
        },
        insumoId: {
          type: 'string',
          example: '068497fc-4c83-42cf-bef5-20775f8db4ae',
        },
        examenId: {
          type: 'string',
          example: '6987a4a6-3cbb-4854-9e22-e7055f37771d',
        },
        is_active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'El Insumo-Examen ha sido actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Insumo-Examen no encontrado',
  })
  update(@Param('id') id: string, @Body() updateInsumoExamenDto: UpdateInsumoExamenDto) {
    return this.insumoExamenesService.update(id, updateInsumoExamenDto);
  }

  @AuthorizedRoles()
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar (soft delete) un Insumo-Examen',
    description: 'Este endpoint elimina un Insumo-Examen sin borrarlo físicamente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del Insumo-Examen a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Insumo-Examen desactivado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Insumo-Examen no encontrado',
  })
  remove(@Param('id') id: string) {
    return this.insumoExamenesService.softDelete(id);
  }
}
