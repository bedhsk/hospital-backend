import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InsumoExamenesService } from './insumo_examenes.service';
import CreateInsumoExamenDto from './dtos/create-insumo_examen.dto';
import UpdateInsumoExamenDto from './dtos/update-insumo_examen.dto';
import QueryInsumoExamenDto from './dtos/query-insumo_examen.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('InsumoExamenes')
@Controller('insumo-examenes')
export class InsumoExamenesController {
  constructor(private readonly insumoExamenesService: InsumoExamenesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva relación entre Insumo y Examen',
    description: 'Este endpoint crea una nueva relación entre Insumo y Examen',
  })
  @ApiResponse({
    status: 201,
    description: 'Relación entre Insumo y Examen creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o incompletos',
  })
  create(@Body() createInsumoExamenDto: CreateInsumoExamenDto) {
    return this.insumoExamenesService.create(createInsumoExamenDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las relaciones activas entre Insumo y Examen',
    description: 'Este endpoint devuelve una lista de todas las relaciones activas entre Insumos y Exámenes',
  })
  @ApiQuery({
    name: 'insumoId',
    type: String,
    required: false,
    description: 'Filtrar por ID del Insumo',
  })
  @ApiQuery({
    name: 'examenId',
    type: String,
    required: false,
    description: 'Filtrar por ID del Examen',
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
    description: 'Relaciones obtenidas exitosamente',
  })
  findAll(@Query() query: QueryInsumoExamenDto) {
    return this.insumoExamenesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una relación entre Insumo y Examen por ID',
    description: 'Este endpoint devuelve una relación entre Insumo y Examen por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la relación a buscar',
    example: 'f7b1c4c3-3e2b-4b4b-8f7b-3d6c7b7b7b7b',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación no encontrada o desactivada',
  })
  findOne(@Param('id') id: string) {
    return this.insumoExamenesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una relación entre Insumo y Examen',
    description: 'Este endpoint permite actualizar una relación existente entre Insumo y Examen',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación no encontrada o desactivada',
  })
  update(@Param('id') id: string, @Body() updateInsumoExamenDto: UpdateInsumoExamenDto) {
    return this.insumoExamenesService.update(id, updateInsumoExamenDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar (soft delete) una relación entre Insumo y Examen',
    description: 'Este endpoint desactiva una relación entre Insumo y Examen sin eliminarla físicamente de la base de datos',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la relación a eliminar (soft delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación desactivada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación no encontrada o ya desactivada',
  })
  remove(@Param('id') id: string) {
    return this.insumoExamenesService.remove(id);
  }
}
