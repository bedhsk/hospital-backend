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
  import { OrdenLaboratoriosService } from './orden_laboratorios.service';
  import CreateOrdenLaboratorioDto from './dtos/create-orden-laboratorio.dto';
  import UpdateOrdenLaboratorioDto from './dtos/update-orden-laboratorio.dto';
  import QueryOrdenLaboratorioDto from './dtos/query-orden-laboratorio.dto';
  import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';

  
  @ApiTags('OrdenLaboratorio')
  @Controller('orden-laboratorio')
  export class OrdenLaboratoriosController {
    constructor(private readonly ordenLaboratorioService: OrdenLaboratoriosService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Crear una nueva orden de laboratorio',
      description: 'Este endpoint sirve para crear una nueva orden de laboratorio',
    })
    @ApiResponse({
      status: 201,
      description: 'Orden de laboratorio creada exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          descripcion: { type: 'string', example: 'Análisis de sangre' },
          estado: { type: 'string', example: 'pendiente' },
          usuarioId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
          pacienteId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
          examenId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174003' },
          retiroId: { type: 'string', nullable: true, example: null },
          is_active: { type: 'boolean', example: true },
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Datos inválidos, revisa los campos enviados',
    })
    create(@Body() createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
      return this.ordenLaboratorioService.createByExams(createOrdenLaboratorioDto);
    }

    @AuthorizedRoles()
    @Post(':id/retiro')
    retire(@Param('id') id: string) {
      return this.ordenLaboratorioService.retireOrderLaboratorio(id);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Obtener todas las órdenes de laboratorio',
      description: 'Este endpoint devuelve todas las órdenes de laboratorio, con filtros y paginación opcionales.',
    })
    @ApiQuery({
      name: 'q',
      type: String,
      required: false,
      description: 'Filtro por nombre del paciente.',
      example: 'Juan Pérez',
    })
    @ApiQuery({
      name: 'filter',
      type: String,
      required: false,
      description: 'Filtro por estado de la orden.',
      example: 'pendiente',
    })
    @ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'Número de página para la paginación.',
      example: 1,
    })
    @ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Número de resultados por página.',
      example: 10,
    })
    @ApiResponse({
      status: 200,
      description: 'Lista de órdenes de laboratorio obtenida exitosamente.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                descripcion: { type: 'string', example: 'Análisis de sangre' },
                estado: { type: 'string', example: 'pendiente' },
                usuario: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
                paciente: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
                examen: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
                retiro: { type: 'object', nullable: true, properties: { id: { type: 'string' }, fecha: { type: 'date' } } },
                is_active: { type: 'boolean', example: true },
              },
            },
          },
          totalItems: { type: 'number', example: 100 },
          totalPages: { type: 'number', example: 10 },
          page: { type: 'number', example: 1 },
        },
      },
    })
    findAll(@Query() query: QueryOrdenLaboratorioDto) {
      return this.ordenLaboratorioService.findAll(query);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Obtener una orden de laboratorio por ID',
      description: 'Este endpoint devuelve una única orden de laboratorio basada en su ID.',
    })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID de la orden de laboratorio',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: 200,
      description: 'Orden de laboratorio obtenida exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          descripcion: { type: 'string', example: 'Análisis de sangre' },
          estado: { type: 'string', example: 'pendiente' },
          usuario: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
          paciente: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
          examen: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
          retiro: { type: 'object', nullable: true, properties: { id: { type: 'string' }, fecha: { type: 'date' } } },
          is_active: { type: 'boolean', example: true },
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Orden de laboratorio no encontrada',
    })
    findOne(@Param('id') id: string) {
      return this.ordenLaboratorioService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({
      summary: 'Actualizar una orden de laboratorio',
      description: 'Este endpoint sirve para actualizar los datos de una orden de laboratorio existente.',
    })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID de la orden de laboratorio a actualizar',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
      description: 'Datos a actualizar en la orden de laboratorio',
      schema: {
        type: 'object',
        properties: {
          descripcion: { type: 'string', example: 'Análisis de orina' },
          estado: { type: 'string', example: 'completado' },
        },
      },
    })
    @ApiResponse({
      status: 201,
      description: 'Orden de laboratorio actualizada exitosamente',
    })
    @ApiResponse({
      status: 404,
      description: 'Orden de laboratorio no encontrada',
    })
    update(
      @Param('id') id: string,
      @Body() updateOrdenLaboratorioDto: UpdateOrdenLaboratorioDto,
    ) {
      return this.ordenLaboratorioService.update(id, updateOrdenLaboratorioDto);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar (soft delete) una orden de laboratorio',
      description: 'Este endpoint elimina una orden de laboratorio de manera lógica, es decir, no la borra físicamente sino que la desactiva.',
    })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID de la orden de laboratorio a eliminar',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: 200,
      description: 'Orden de laboratorio desactivada exitosamente',
    })
    @ApiResponse({
      status: 404,
      description: 'Orden de laboratorio no encontrada',
    })
    remove(@Param('id') id: string) {
      return this.ordenLaboratorioService.softDelete(id);
    }


    @Post('examen')
    @ApiOperation({
      summary: 'Crear una nueva orden de laboratorio en funcion de un examen predeterminado',
      description: 'Este endpoint sirve para crear una nueva orden de laboratorio',
    })
    @ApiResponse({
      status: 201,
      description: 'Orden de laboratorio creada exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          descripcion: { type: 'string', example: 'Análisis de sangre' },
          estado: { type: 'string', example: 'pendiente' },
          usuarioId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
          pacienteId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
          examenId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174003' },
          retiroId: { type: 'string', nullable: true, example: null },
          is_active: { type: 'boolean', example: true },
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Datos inválidos, revisa los campos enviados',
    })
    createByExam(@Body() createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
      return this.ordenLaboratorioService.createByExams(createOrdenLaboratorioDto);
    }
  }
  