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
import { CategoriasService } from './categorias.service';
import CreateCategoriaDto from './dto/create-categoria.dto';
import UpdateCategoriaDto from './dto/update-categoria.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryCategoriarDto from './dto/query-categoria.dto';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva categoría',
    description: 'Este endpoint sirve para crear nuevas categorías',
  })
  @ApiResponse({
    status: 201,
    description: 'La categoría ha sido creada',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
        },
        nombre: {
          type: 'string',
          example: 'Electrónica',
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
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Obtiene todas las categorías',
    description:
      'Este endpoint sirve para retornar todas las categorías activas en la base de datos.',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
    description: 'Nombre de la categoría para filtrar.',
    example: 'Categoría A',
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
    description: 'Categorías obtenidas exitosamente.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174003',
          },
          nombre: { type: 'string', example: 'Categoría A' },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll(@Query() query: QueryCategoriarDto) {
    return this.categoriasService.findAll(query);
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar una categoría',
    description: 'Este endpoint sirve para buscar una categoría por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Id de la categoría a buscar',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la categoría',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
        },
        nombre: {
          type: 'string',
          example: 'Electrónica',
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
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(id);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Actualizar una categoría',
    description: 'Este endpoint sirve para actualizar una categoría',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Id de la categoría a actualizar',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
  })
  @ApiBody({
    description: 'Datos a actualizar',
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          example: 'Electrónica',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'La categoría ha sido actualizada',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
        },
        nombre: {
          type: 'string',
          example: 'Electrónica',
        },
        is_active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Eliminar una categoría (soft delete)',
    description:
      'Este endpoint sirve para eliminar (soft delete) una categoría',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Id de la categoría a eliminar',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría desactivada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.softDelete(id);
  }
}
