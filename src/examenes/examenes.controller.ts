import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExamenesService } from './examenes.service';
import CreateExamenDto from './dtos/create-examen.dto';
import UpdateExamenDto from './dtos/update-examen.dto';
import QueryExamenDto from './dtos/query-examen.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Examenes')
@Controller('examenes')
export class ExamenesController {
  constructor(private readonly examenesService: ExamenesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo examen',
    description: 'Este endpoint permite la creación de un nuevo examen',
  })
  @ApiResponse({
    status: 201,
    description: 'El examen ha sido creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        nombre: { type: 'string', example: 'Examen de Sangre' },
        descripcion: { type: 'string', example: 'Análisis completo de sangre' },
        is_active: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o incompletos',
  })
  create(@Body() createExamenDto: CreateExamenDto) {
    return this.examenesService.create(createExamenDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los exámenes',
    description: 'Este endpoint devuelve todos los exámenes activos, con paginación y filtrado opcional',
  })
  @ApiQuery({
    name: 'nombre',
    type: String,
    required: false,
    description: 'Filtrar por nombre del examen',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Número de página para paginación',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Número de elementos por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exámenes obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              nombre: { type: 'string', example: 'Examen de Sangre' },
              descripcion: { type: 'string', example: 'Análisis completo de sangre' },
              is_active: { type: 'boolean', example: true },
            },
          },
        },
        totalItems: { type: 'number', example: 100 },
        totalPages: { type: 'number', example: 10 },
        currentPage: { type: 'number', example: 1 },
      },
    },
  })
  findAll(@Query() query: QueryExamenDto) {
    return this.examenesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un examen por ID',
    description: 'Este endpoint devuelve los detalles de un examen específico',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del examen a buscar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Examen encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        nombre: { type: 'string', example: 'Examen de Sangre' },
        descripcion: { type: 'string', example: 'Análisis completo de sangre' },
        is_active: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Examen no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.examenesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un examen',
    description: 'Este endpoint permite actualizar los datos de un examen existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del examen a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Examen actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        nombre: { type: 'string', example: 'Examen de Sangre' },
        descripcion: { type: 'string', example: 'Análisis completo de sangre' },
        is_active: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Examen no encontrado',
  })
  update(@Param('id') id: string, @Body() updateExamenDto: UpdateExamenDto) {
    return this.examenesService.update(id, updateExamenDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar (Soft Delete) un examen',
    description: 'Este endpoint desactiva un examen sin eliminarlo físicamente de la base de datos',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del examen a eliminar (Soft Delete)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Examen desactivado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Examen no encontrado o ya desactivado',
  })
  remove(@Param('id') id: string) {
    return this.examenesService.softDelete(id);
  }
}
