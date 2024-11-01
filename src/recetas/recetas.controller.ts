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
import { RecetasService } from './recetas.service';
import CreateRecetaDto from './dto/create-receta.dto';
import UpdateRecetaDto from './dto/update-receta.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryRecetaDto from './dto/query-receta.dto';
import RetireRecetaDto from './dto/retire-receta.dto';

@ApiTags('Recetas')
@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear receta',
    description: 'Crear una nueva receta',
  })
  @ApiBody({
    description: 'Datos de la receta',
    schema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string', example: 'Receta para dolor de cabeza' },
        userId: {
          type: 'number',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        pacienteId: {
          type: 'number',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Receta creada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        descripcion: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
          },
        },
        paciente: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nombre: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  create(@Body() createRecetaDto: CreateRecetaDto) {
    return this.recetasService.create(createRecetaDto);
  }

  @AuthorizedRoles()
  @Post(':id/retiro')
  retire(@Param('id') id: string, @Body() body: RetireRecetaDto) {
    return this.recetasService.retiroReceta(id, body);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Listar recetas',
    description: 'Listar recetas con filtros',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
    description: 'Nombre del usuario para filtrar.',
    example: 'Maria',
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
    description: 'Nombre del paciente para filtrar',
    example: 'Ricardo',
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
    description: 'Listado de recetas',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              descripcion: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                },
              },
              paciente: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  nombre: { type: 'string' },
                },
              },
            },
          },
        },
        totalItems: { type: 'number' },
        totalPages: { type: 'number' },
        page: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll(@Query() query: QueryRecetaDto) {
    const records = this.recetasService.findAll(query);
    return records;
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar receta',
    description: 'Buscar receta por ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID de la receta',
  })
  @ApiResponse({
    status: 200,
    description: 'Receta encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        descripcion: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
          },
        },
        paciente: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nombre: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.recetasService.findOnePublic(id);
  }

  @AuthorizedRoles()
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar receta',
    description: 'Actualizar receta por ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID de la receta',
  })
  @ApiBody({
    description: 'Datos de la receta',
    schema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string', example: 'Receta para dolor de cabeza' },
        userId: {
          type: 'number',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        pacienteId: {
          type: 'number',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Receta actualizada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        descripcion: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
          },
        },
        paciente: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nombre: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  update(@Param('id') id: string, @Body() body: UpdateRecetaDto) {
    return this.recetasService.update(id, body);
  }

  @AuthorizedRoles()
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar receta',
    description: 'Eliminar receta por ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID de la receta',
  })
  @ApiResponse({
    status: 204,
    description: 'Receta eliminada',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.recetasService.remove(id);
  }
}
