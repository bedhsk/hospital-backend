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
    description: 'Este endpoint crea un nuevo examen en la base de datos',
  })
  @ApiResponse({
    status: 201,
    description: 'Examen creado exitosamente',
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
    description: 'Este endpoint devuelve una lista de todos los exámenes activos registrados',
  })
  @ApiQuery({
    name: 'nombre',
    type: String,
    required: false,
    description: 'Nombre del examen para filtrar',
    example: 'Examen de sangre',
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
    description: 'Número de resultados por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Exámenes obtenidos exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en los parámetros de consulta',
  })
  findAll(@Query() query: QueryExamenDto) {
    return this.examenesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un examen por ID',
    description: 'Devuelve un examen específico identificado por su ID, solo si está activo',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del examen',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
  })
  @ApiResponse({
    status: 200,
    description: 'Examen encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Examen no encontrado o desactivado',
  })
  findOne(@Param('id') id: string) {
    return this.examenesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un examen',
    description: 'Este endpoint permite actualizar un examen existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Examen actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Examen no encontrado o desactivado',
  })
  update(@Param('id') id: string, @Body() updateExamenDto: UpdateExamenDto) {
    return this.examenesService.update(id, updateExamenDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar (soft delete) un examen',
    description: 'Este endpoint desactiva un examen sin eliminarlo físicamente de la base de datos',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del examen a eliminar',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
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
    return this.examenesService.remove(id);
  }
}
