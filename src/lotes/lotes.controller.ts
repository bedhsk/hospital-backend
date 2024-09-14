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
import { LotesService } from './lotes.service';
import CreateLoteDto from './dtos/create-lote.dto';
import UpdateLoteDto from './dtos/update-lote.dto';
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiBody,
    ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryLoteDto from './dtos/query-lote.dto';

@ApiTags('Lotes')
@Controller('lotes')
export class LotesController {
    constructor(private readonly lotesService: LotesService) { }

    @AuthorizedRoles()
    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo lote',
        description: 'Este endpoint sirve para crear un nuevo lote',
    })
    @ApiResponse({
        status: 201,
        description: 'El lote ha sido creado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000',
                },
                numeroLote: {
                    type: 'string',
                    example: 'LOT-001',
                },
                fechaFabricacion: {
                    type: 'string',
                    example: '2024-09-01',
                },
                fechaCaducidad: {
                    type: 'string',
                    example: '2025-09-01',
                },
                cantidad: {
                    type: 'number',
                    example: 100,
                },
                insumoId: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174001',
                },
                insumoDepartamentoId: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174002',
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
    create(@Body() createLoteDto: CreateLoteDto) {
        return this.lotesService.create(createLoteDto);
    }

    @AuthorizedRoles()
    @Get()
    @ApiOperation({
        summary: 'Listar todos los lotes activos',
        description: 'Este endpoint sirve para listar todos los lotes activos',
    })
    @ApiResponse({
        status: 200,
        description: 'Listado de lotes activos',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: '123e4567-e89b-12d3-a456-426614174000',
                    },
                    numeroLote: {
                        type: 'string',
                        example: 'LOT-001',
                    },
                    fechaFabricacion: {
                        type: 'string',
                        example: '2024-09-01',
                    },
                    fechaCaducidad: {
                        type: 'string',
                        example: '2025-09-01',
                    },
                    cantidad: {
                        type: 'number',
                        example: 100,
                    },
                    is_active: {
                        type: 'boolean',
                        example: true,
                    },
                },
            },
        },
    })
    findAll(@Query() query: QueryLoteDto) {
        return this.lotesService.findAll(query);
      }

    @AuthorizedRoles()
    @Get(':id')
    @ApiOperation({
        summary: 'Buscar un lote por ID',
        description: 'Este endpoint sirve para buscar un lote por su ID, si está activo',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del lote a buscar',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Detalles del lote activo',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000',
                },
                numeroLote: {
                    type: 'string',
                    example: 'LOT-001',
                },
                fechaFabricacion: {
                    type: 'string',
                    example: '2024-09-01',
                },
                fechaCaducidad: {
                    type: 'string',
                    example: '2025-09-01',
                },
                cantidad: {
                    type: 'number',
                    example: 100,
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
        description: 'Lote no encontrado o desactivado',
    })
    findOne(@Param('id') id: string) {
        return this.lotesService.findOne(id);
    }

    @AuthorizedRoles()
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un lote existente',
        description: 'Este endpoint sirve para actualizar un lote existente',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del lote a actualizar',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
        description: 'Datos del lote a actualizar',
        schema: {
            type: 'object',
            properties: {
                numeroLote: {
                    type: 'string',
                    example: 'LOT-001',
                },
                fechaFabricacion: {
                    type: 'string',
                    example: '2024-09-01',
                },
                fechaCaducidad: {
                    type: 'string',
                    example: '2025-09-01',
                },
                cantidad: {
                    type: 'number',
                    example: 100,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'El lote ha sido actualizado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000',
                },
                numeroLote: {
                    type: 'string',
                    example: 'LOT-001',
                },
                fechaFabricacion: {
                    type: 'string',
                    example: '2024-09-01',
                },
                fechaCaducidad: {
                    type: 'string',
                    example: '2025-09-01',
                },
                cantidad: {
                    type: 'number',
                    example: 100,
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
        description: 'Lote no encontrado o desactivado',
    })
    update(@Param('id') id: string, @Body() updateLoteDto: UpdateLoteDto) {
        return this.lotesService.update(id, updateLoteDto);
    }

    @AuthorizedRoles()
    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar (soft delete) un lote',
        description: 'Este endpoint sirve para eliminar un lote sin borrarlo físicamente de la base de datos',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID del lote a eliminar',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Lote desactivado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Lote no encontrado o ya desactivado',
    })
    remove(@Param('id') id: string) {
        return this.lotesService.softDelete(id);
    }
}
