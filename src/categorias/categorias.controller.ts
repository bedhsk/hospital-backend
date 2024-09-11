import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import CreateCategoriaDto from './dtos/create-categoria.dto';
import UpdateCategoriaDto from './dtos/update-categoria.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

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
    summary: 'Listar Categorías',
    description: 'Este endpoint sirve para listar todas las categorías',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de categorías',
    schema: {
      type: 'array',
      items: {
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
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findAll() {
    return this.categoriasService.findAll();
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
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Eliminar una categoría (soft delete)',
    description: 'Este endpoint sirve para eliminar (soft delete) una categoría',
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
