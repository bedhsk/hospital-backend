import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import QueryPacienteDto from './dto/query-paciente.dto';
import { PacientesService } from './pacientes.service';
import CreatePacienteDto from './dto/create-paciente.dto';
import UpdatePacienteDto from './dto/update-paciente.dto';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';

@ApiTags('Pacientes')
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) { }
  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los pacientes',
    description: 'Este endpoint sirve para retornar todos los pacientes existentes en la base de datos.',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
    description: 'Nombre del paciente para filtrar.',
    example: 'Juan',
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
    description: 'Sexo del paciente para filtrar.',
    example: 'Masculino',
  })
  @ApiQuery({
    name: 'filterCui',
    type: String,
    required: false,
    description: 'CUI del paciente para filtrar.',
    example: '1234567890123',
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
    description: 'Pacientes obtenidos exitosamente.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
              nombre: { type: 'string', example: 'Juana' },
              sexo: { type: 'string', example: 'Femenino' },
              cui: { type: 'string', example: '1234567890123' },
              nacimiento: { type: 'date', example: '1980-01-01' },
              familiares: { type: 'string', example: 'Padre, Madre' },
              medicos: { type: 'string', example: 'Dr. Smith' },
              quirurgicos: { type: 'string', example: 'Apendicectomía' },
              traumaticos: { type: 'string', example: 'Fractura de pierna' },
              alergias: { type: 'string', example: 'Penicilina' },
              vicios: { type: 'string', example: 'Tabaco' },
              createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
              antecedente: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'b9d78e40-9d56-4e23-8a94-1e9a5f77e4f6' },
                  gestas: { type: 'number', example: 2 },
                  hijos_vivos: { type: 'number', example: 1 },
                  hijos_muertos: { type: 'number', example: 0 },
                  abortos: { type: 'number', example: 0 },
                  ultima_regla: { type: 'date', example: '2024-06-01' },
                  planificacion_familiar: { type: 'number', example: 0 },
                  partos: { type: 'number', example: 2 },
                  cesareas: { type: 'number', example: 0 },
                  createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
                },
              },
            },
          },
        },
        totalItems: { type: 'number', example: 100 },
        totalPages: { type: 'number', example: 10 },
        page: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll(@Query() query: QueryPacienteDto) {
    console.log(query)
    const records = this.pacientesService.findAll(query);
    return records;
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un paciente por ID',
    description: 'Este endpoint sirve para retornar un paciente específico por su ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del paciente.',
    example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente obtenido exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
        nombre: { type: 'string', example: 'Juana' },
        sexo: { type: 'string', example: 'Femenino' },
        cui: { type: 'string', example: '1234567890123' },
        nacimiento: { type: 'date', example: '1980-01-01' },
        familiares: { type: 'string', example: 'Padre, Madre' },
        medicos: { type: 'string', example: 'Dr. Smith' },
        quirurgicos: { type: 'string', example: 'Apendicectomía' },
        traumaticos: { type: 'string', example: 'Fractura de pierna' },
        alergias: { type: 'string', example: 'Penicilina' },
        vicios: { type: 'string', example: 'Tabaco' },
        createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
        antecedente: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'b9d78e40-9d56-4e23-8a94-1e9a5f77e4f6' },
            gestas: { type: 'number', example: 2 },
            hijos_vivos: { type: 'number', example: 1 },
            hijos_muertos: { type: 'number', example: 0 },
            abortos: { type: 'number', example: 0 },
            ultima_regla: { type: 'date', example: '2024-06-01' },
            planificacion_familiar: { type: 'number', example: 0 },
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 0 },
            createdAt: { type: 'string', example: '2024-08-29T01:38:11.779Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado.',
  })
  findOne(@Param('id') id: string) {
    console.log(id)
    return this.pacientesService.findOne(id);
  }

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crea un nuevo paciente',
    description: 'Este endpoint sirve para crear un nuevo paciente en la base de datos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente creado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
        nombre: { type: 'string', example: 'Juana' },
        sexo: { type: 'string', example: 'Femenino' },
        cui: { type: 'string', example: '1234567890123' },
        nacimiento: { type: 'date', example: '1980-01-01' },
        familiares: { type: 'string', example: 'Padre, Madre' },
        medicos: { type: 'string', example: 'Dr. Smith' },
        quirurgicos: { type: 'string', example: 'Apendicectomía' },
        traumaticos: { type: 'string', example: 'Fractura de pierna' },
        alergias: { type: 'string', example: 'Penicilina' },
        vicios: { type: 'string', example: 'Tabaco' },
        createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
        antecedente: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'b9d78e40-9d56-4e23-8a94-1e9a5f77e4f6' },
            gestas: { type: 'number', example: 2 },
            hijos_vivos: { type: 'number', example: 1 },
            hijos_muertos: { type: 'number', example: 0 },
            abortos: { type: 'number', example: 0 },
            ultima_regla: { type: 'date', example: '2024-06-01' },
            planificacion_familiar: { type: 'number', example: 0 },
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 0 },
            createdAt: { type: 'date', example: '2024-08-29T01:38:11.779Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo usuario, el resto de datos son opcionales, los antecedentes se insertan desde Antecedentes y solo los pacientes femeninos pueden tener por el hecho que son antecedentes ginecologicos',
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          example: 'Maria',
        },
        sexo: {
          type: 'string',
          example: 'Femenino',
        },
        nacimiento: {
          type: 'date',
          example: '1990-01-01',
        }
      },
    },
  })
  create(@Body() body: CreatePacienteDto) {
    return this.pacientesService.create(body);
 
  }
  @AuthorizedRoles()
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualiza un paciente existente',
    description: 'Este endpoint sirve para actualizar la información de un paciente existente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del paciente.',
    example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente actualizado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '59271b3e-e4ca-4434-8064-048a094ec8dc' },
        nombre: { type: 'string', example: 'Juana' },
        sexo: { type: 'string', example: 'Masculino' },
        cui: { type: 'string', example: '1234567890123' },
        nacimiento: { type: 'string', example: '1980-01-01' },
        familiares: { type: 'string', example: 'Padre, Madre' },
        medicos: { type: 'string', example: 'Dr. Smith' },
        quirurgicos: { type: 'string', example: 'Apendicectomía' },
        traumaticos: { type: 'string', example: 'Fractura de pierna' },
        alergias: { type: 'string', example: 'Penicilina' },
        vicios: { type: 'string', example: 'Tabaco' },
        createdAt: { type: 'string', example: '2024-08-29T01:38:11.779Z' },
        antecedente: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'b9d78e40-9d56-4e23-8a94-1e9a5f77e4f6' },
            gestas: { type: 'number', example: 2 },
            hijos_vivos: { type: 'number', example: 1 },
            hijos_muertos: { type: 'number', example: 0 },
            abortos: { type: 'number', example: 0 },
            ultima_regla: { type: 'string', example: '2024-06-01' },
            planificacion_familiar: { type: 'number', example: 0},
            partos: { type: 'number', example: 2 },
            cesareas: { type: 'number', example: 0 },
            createdAt: { type: 'string', example: '2024-08-29T01:38:11.779Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta.',
  })
  @ApiBody({
    description: 'Se puede actualizar cualquier campo, los antecedentes se modifican desde Antecedentes, solo se necesita el ID del paceinte para modificar',
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          example: 'Maria',
        },
        sexo: {
          type: 'string',
          example: 'Femenino',
        },
        nacimiento: {
          type: 'date',
          example: '1990-01-01',
        }
      },
    },
  })
  update(@Param('id') id: string, @Body() body: UpdatePacienteDto) {
    return this.pacientesService.update(id, body);
  }

  @AuthorizedRoles()
  @Delete(':id')
  @ApiOperation({
    summary: 'Elimina un paciente',
    description: 'Este endpoint sirve para eliminar (soft delete) un paciente por su ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del paciente.',
    example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(id);
  }



}
