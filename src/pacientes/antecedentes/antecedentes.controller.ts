import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { AntecedentesService } from './antecedentes.service';
import QueryAntecedenteDto from '../dto/query-antecedente.dto';
import CreateAntecedenteDto from '../dto/create-antecedente.dto';
import UpdateAntecedenteDto from '../dto/update-antecedente.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';

@ApiTags('Antecedentes_Ginecologicos')
@Controller('antecedentes')
export class AntecedentesController {

    constructor(private readonly antecedentesService: AntecedentesService) { }
    @AuthorizedRoles()
    @Get()
    @ApiOperation({
        summary: 'Obtiene todos los antecedentes',
        description: 'Este endpoint retorna todos los antecedentes existentes en la base de datos.',
      })
      @ApiQuery({
        name: 'filter',
        type: String,
        required: false,
        description: 'Nombre del paciente para filtrar.',
        example: 'Maria',
      })
      @ApiQuery({
        name: 'filterCui',
        type: String,
        required: false,
        description: 'CUI del paciente para filtrar.',
        example: '123456',
      })
      @ApiQuery({
        name: 'filterId',
        type: String,
        required: false,
        description: 'ID del paciente para filtrar.',
        example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
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
        description: 'Antecedentes obtenidos exitosamente.',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
                  paciente: { type: 'object', properties: { id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' }, nombre: { type: 'string', example: 'Maria' } } },
                  createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
                  gestas: { type: 'number', example: 3 },
                  hijos_vivos: { type: 'number', example: 2 },
                  hijos_muertos: { type: 'number', example: 1 },
                  abortos: { type: 'number', example: 2 },
                  ultima_regla: { type: 'date', example: '2024-07-15' },
                  planificacion_familiar: { type: 'number', example: 1 },
                  partos: { type: 'number', example: 2 },
                  cesareas: { type: 'number', example: 1 },
                },
              },
            },
            totalItems: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 },
            page: { type: 'number', example: 1 },
          },
        },
      })
      @ApiResponse({
        status: 403,
        description: 'Acceso denegado.',
      })
    findAll(@Query() query: QueryAntecedenteDto) {
      console.log(query)
      const records = this.antecedentesService.findAll(query);
      return records;
    }
  
    @AuthorizedRoles()
    @Get(':id')
    @ApiOperation({
        summary: 'Obtiene un antecedente por ID',
        description: 'Este endpoint encuentra un antecedente por medio del ID.',
      })
      @ApiParam({
        name: 'id',
        type: String,
        description: 'ID del antecedente que se desea obtener.',
        example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
      })
      @ApiResponse({
        status: 200,
        description: 'Antecedente obtenido exitosamente.',
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
            paciente: { type: 'object', properties: { id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' }, nombre: { type: 'string', example: 'Maria' } } },
            createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
            gestas: { type: 'number', example: 3 },
            hijos_vivos: { type: 'number', example: 2 },
            hijos_muertos: { type: 'number', example: 1 },
            abortos: { type: 'number', example: 2 },
            ultima_regla: { type: 'date', example: '2024-07-15' },
            planificacion_familiar: { type: 'number', example: 1 },
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 1 },
          },
        },
      })
      @ApiResponse({
        status: 403,
        description: 'Acceso denegado.',
      })
    findOne(@Param('id') id: string) {

      return this.antecedentesService.findOne(id);
    }
  
    @AuthorizedRoles()
    @Post()
    @ApiOperation({
        summary: 'Crea un nuevo antecedente',
        description: 'Este endpoint sirve para crear nuevos antecedentes en la base de datos.',
      })
      @ApiBody({
        description: 'Ejemplo para crear un antecedente, el unico dato necesario es el id de un Paciente del sexo femeninio',
        schema: {
          type: 'object',
          properties: {
            pacienteId: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
            gestas: { type: 'number', example: 3 },
            hijos_vivos: { type: 'number', example: 2 },
            hijos_muertos: { type: 'number', example: 1 },
            abortos: { type: 'number', example: 2 },
            ultima_regla: { type: 'date', example: '2024-07-15' },
            planificacion_familiar: { type: 'number', example: 1 },
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 1 },
          },
        },
      })
      @ApiResponse({
        status: 201,
        description: 'Antecedente creado exitosamente.',
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
            paciente: { type: 'object', properties: { id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' }, nombre: { type: 'string', example: 'Maria' } } },
            createdAt: { type: 'string', example: '2024-08-29T01:38:11.779Z' },
            gestas: { type: 'number', example: 3 },
            hijos_vivos: { type: 'number', example: 2 },
            hijos_muertos: { type: 'number', example: 1 },
            abortos: { type: 'number', example: 2 },
            ultima_regla: { type: 'string', example: '2024-07-15' },
            planificacion_familiar: { type: 'number', example: 1 },
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 1 },
          },
        },
      })
      @ApiResponse({
        status: 400,
        description: 'Solicitud incorrecta. Puede ser que el paciente no se haya encontrado.',
      })
    create(@Body() body: CreateAntecedenteDto) {
      return this.antecedentesService.create(body);
   
    }
    
    @AuthorizedRoles()
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualiza un antecedente existente',
        description: 'Este endpoint sirve para actualizar los datos de un antecedente existente.',
      })
      @ApiParam({
        name: 'id',
        type: String,
        description: 'ID del antecedente que se desea actualizar.',
        example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
      })
      @ApiBody({
        description: 'Datos de ejemplo para actualizar un antecedente.',
        schema: {
          type: 'object',
          properties: {
            pacienteId: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
            gestas: { type: 'number', example: 3 },
            hijos_vivos: { type: 'number', example: 2 },
            hijos_muertos: { type: 'number', example: 1 },
            abortos: { type: 'number', example: 2 },
            ultima_regla: { type: 'date', example: '2024-07-15' },
            planificacion_familiar: { type: 'number', example: 1 },
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 1 },
          },
        },
      })
      @ApiResponse({
        status: 200,
        description: 'Antecedente actualizado exitosamente.',
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
            paciente: { type: 'object', properties: { id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' }, nombre: { type: 'string', example: 'Maria' } } },
            createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
            gestas: { type: 'number', example: 3 },
            hijos_vivos: { type: 'number', example: 2 },
            hijos_muertos: { type: 'number', example: 1 },
            abortos: { type: 'number', example: 2 },
            ultima_regla: { type: 'date', example: '2024-07-15' },
            planificacion_familiar: { type: 'number', example: 1 },
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 1 },
          },
        },
      })
      @ApiResponse({
        status: 400,
        description: 'Solicitud incorrecta. Puede ser que el paciente no se haya encontrado.',
      })
      @ApiResponse({
        status: 404,
        description: 'Antecedente no encontrado.',
      })
    update(@Param('id') id: string, @Body() body: UpdateAntecedenteDto) {
      return this.antecedentesService.update(id, body);
    }
  
  
  


}
