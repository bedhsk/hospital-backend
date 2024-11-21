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
import { DepartamentosService } from './departamentos.service';
import UpdateDepartamentoDto from './dto/update-departamento.dto';
import CreateDepartamentoDto from './dto/create-departamento.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryDepartamentoDto from './dto/query-departamento.dto';

@ApiTags('Departamentos')
@Controller('departamentos')
export class DepartamentosController {
  constructor(private readonly departamentosService: DepartamentosService) {}

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo departamento',
    description: 'Este endpoint sirve para crear nuevos departamentos',
  })
  @ApiResponse({
    status: 201,
    description: 'El departamento ha sido creado',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
        },
        nombre: {
          type: 'string',
          example: 'Laboratorio',
        },
        is_Active: {
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
  create(@Body() body: CreateDepartamentoDto) {
    return this.departamentosService.create(body);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Listar Departamentos',
    description: 'Este endpoint sirve para listar todos los departamentos',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findAll(@Query() query: QueryDepartamentoDto) {
    return this.departamentosService.findAll(query);
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar un departamento',
    description: 'Este endpoint sirve para buscar un departamento',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findOne(@Param('id') id: string, @Query() query: QueryDepartamentoDto) {
    return this.departamentosService.findOneWithDepartamentos(id, query);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Actualizar un departamento',
    description: 'Este endpoint sirve para actualizar un departamento',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Id del departamento a actualizar',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
  })
  @ApiBody({
    description: 'Datos a actualizar',
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          example: 'Laboratorio',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'El departamento ha sido actualizado',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
        },
        nombre: {
          type: 'string',
          example: 'Laboratorio',
        },
        is_Active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateDepartamentoDto) {
    return this.departamentosService.update(id, body);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Eliminar un departamento',
    description: 'Este endpoint sirve para eliminar un departamento',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Id del departamento a eliminar',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
  })
  @ApiResponse({
    status: 200,
    description: 'Departamento desactivado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Departamento no encontrado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departamentosService.remove(id);
  }
}
