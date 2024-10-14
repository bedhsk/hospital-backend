import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import CreateRetiroDto from './dto/create-retiro.dto';
import { RetirosService } from './retiros.service';
import QueryRetiroDto from './dto/query-retiro.dto';
import UpdateRetiroDto from './dto/update-retiro.dto';
import Retiro from './entities/retiro.entity';

@ApiTags('Retiros y detalleRetiro')
@Controller('retiros')
export class RetirosController {
    constructor(
        private readonly retiroService: RetirosService,
      ) {}
    

      @AuthorizedRoles()
      @Post()
      @ApiBody({
        description: 'Datos de la retiro a crear',
        schema: {
          type: 'object',
          properties: {
            usuarioId: {
              type: 'string',
              example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
            },
            descripcion: {
              type: 'string',
              example: 'Prueba de retiro',
            },
            insumoDepartamentoId: {
              type: 'string',
              example: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
            },
            cantidad: {
              type: 'number',
              example: 10,
            },
          },
        },
      })
      @ApiOperation({ summary: 'Crear un nuevo retiro' })
      @ApiResponse({
        status: 201,
        description: 'La retiro y el detalle han sido creados exitosamente',
        schema: {
          type: 'object',
          properties: {
            retiro: {
              type: 'object',
              properties: {
                descripcion: {
                  type: 'string',
                  example: 'Prueba de retiro',
                },
                is_active: {
                  type: 'boolean',
                  example: true,
                },
                user: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
                    },
                    username: {
                      type: 'string',
                      example: 'Admin',
                    },
                  },
                },
                id: {
                  type: 'string',
                  example: 'c33f4205-3eeb-435f-b3c9-ec056f170275',
                },
                created_at: {
                  type: 'Date',
                  example: '2024-08-29T01:38:11.779Z',
                },
              },
            },
            detalleRetiro: {
              type: 'object',
              properties: {
                is_active: {
                  type: 'boolean',
                  example: true,
                },
                cantidad: {
                  type: 'number',
                  example: 10,
                },
                Retiro: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: 'c33f4205-3eeb-435f-b3c9-ec056f170275',
                    },
                  },
                },
                insumoDepartamento: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
                    },
                    existencia: {
                      type: 'number',
                      example: 210,
                    },
                  },
                },
                id: {
                  type: 'string',
                  example: '052770b9-97c9-460f-9240-7364661373dc',
                },
              },
            },
          },
        },
      })
      @ApiResponse({ status: 404, description: 'Usuario o insumo departamento no encontrado.' })
      create(@Body() createRetiroDto: CreateRetiroDto) {
          return this.retiroService.create(createRetiroDto);
      }
  
      @AuthorizedRoles()
      @Get()
      @ApiResponse({
        status: 200,
        description: 'Retiro con su detalle y departamento obtenidas exitosamente.',
        schema: {
          type: 'object',
          properties: {
            retiro: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'bdda2e12-acae-4c14-8ca3-f009715a2012',
                    description: 'ID del Retiro'
                  },
                  created_at: {
                    type: 'date',
                    format: 'date-time',
                    example: '2024-08-29T01:38:11.779Z',
                    description: 'Fecha de creación del Rretiro'
                  },
                  descripcion: {
                    type: 'string',
                    example: 'Prueba de actualización',
                    description: 'Descripción Retiro'
                  },
                  is_active: {
                    type: 'boolean',
                    example: true,
                    description: 'Indica si el eretiro está activa'
                  },
                  user: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
                        description: 'ID del usuario'
                      },
                      username: {
                        type: 'string',
                        example: 'Admin',
                        description: 'Nombre de usuario del responsable del Retiro'
                      }
                    }
                  },
                  detalleRetiro: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: '18198df1-8a64-409c-9acb-1432cc173864',
                          description: 'ID del detalle de Retiro'
                        },
                        cantidad: {
                          type: 'number',
                          example: 20,
                          description: 'Cantidad retirirada del insumo'
                        },
                        insumoDepartamento: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                              example: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
                              description: 'ID del insumo en el departamento'
                            },
                            existencia: {
                              type: 'number',
                              example: 220,
                              description: 'Cantidad actual del insumo en el departamento'
                            },
                            departamento: {
                              type: 'object',
                              properties: {
                                id: {
                                  type: 'string',
                                  example: '0c54e39a-44dd-4ff6-8aed-fc03790ac3af',
                                  description: 'ID del departamento'
                                },
                                nombre: {
                                  type: 'string',
                                  example: 'departamento1',
                                  description: 'Nombre del departamento al que pertenece el insumo'
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            totalItems: {
              type: 'number',
              example: 1,
              description: 'Número total de Retiros'
            },
            totalPages: {
              type: 'number',
              example: 1,
              description: 'Número total de páginas'
            },
            page: {
              type: 'number',
              example: 1,
              description: 'Página actual de los resultados'
            }
          }
        }
      })
      @ApiOperation({ summary: 'Obtener todos los retiros' })
      @ApiResponse({ status: 200, description: 'Lista de retiros' })
      @ApiQuery({ name: 'filterUser', required: false, description: 'Filtrar por nombre de usuario' })
      @ApiQuery({ name: 'filterDepartamento', required: false, description: 'Filtrar por nombre de departamento' })
      @ApiQuery({ name: 'page', required: false, description: 'Número de página para paginación', type: Number })
      @ApiQuery({ name: 'limit', required: false, description: 'Número de elementos por página', type: Number })
      findAll(@Query() query: QueryRetiroDto) {
          return this.retiroService.findAll(query);
      }
  
      @AuthorizedRoles()
      @Get(':id')
      @ApiResponse({
        status: 200,
        description: 'Detalles de la retiro activa',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'bdda2e12-acae-4c14-8ca3-f009715a2012',
              description: 'ID del retiro'
            },
            created_at: {
              type: 'Date',
              format: 'date-time',
              example: '2024-10-01T05:19:07.624Z',
              description: 'Fecha de creación del retiro'
            },
            descripcion: {
              type: 'string',
              example: 'Prueba de actualización',
              description: 'Descripción del retiro'
            },
            is_active: {
              type: 'boolean',
              example: true,
              description: 'Indica si el retiro está activo'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
                  description: 'ID del usuario'
                },
                username: {
                  type: 'string',
                  example: 'Admin',
                  description: 'Nombre de usuario del responsable del retiro'
                }
              }
            },
            detalleRetiro: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '18198df1-8a64-409c-9acb-1432cc173864',
                    description: 'ID del detalle Retiro'
                  },
                  cantidad: {
                    type: 'number',
                    example: 20,
                    description: 'Cantidad retriada del insumo'
                  },
                  insumoDepartamento: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: 'a92c4fb7-01c7-4f7a-8991-39d759b2132e',
                        description: 'ID del insumo en el departamento'
                      },
                      existencia: {
                        type: 'number',
                        example: 220,
                        description: 'Cantidad actual del insumo en el departamento'
                      },
                      departamento: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            example: '0c54e39a-44dd-4ff6-8aed-fc03790ac3af',
                            description: 'ID del departamento'
                          },
                          nombre: {
                            type: 'string',
                            example: 'departamento1',
                            description: 'Nombre del departamento al que pertenece el insumo'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      })
      @ApiOperation({ summary: 'Obtener un retiro por ID' })
      @ApiResponse({ status: 200, description: 'Retiro encontrado' })
      @ApiResponse({ status: 404, description: 'Retiro no encontrado o desactivada.' })
      @ApiParam({ name: 'id', description: 'ID del retiro' })
      findOne(@Param('id') id: string) {
          return this.retiroService.findOne(id);
      }
  
      @AuthorizedRoles()
      @Patch(':id')
      @ApiOperation({ summary: 'Actualizar un retiro existente' })
      @ApiBody({
        description: 'Datos de la retiro a actualizar',
        schema: {
          type: 'object',
          properties: {
            descripcion: {
              type: 'string',
              example: 'Descripcion de prueba',
            },
            cantidad: {
              type: 'number',
              example: 20,
            },
          },
        },
      })
      @ApiResponse({ status: 200, description: 'Retiro actualizado' })
      @ApiResponse({ status: 404, description: 'Retiro no encontrado o desactivada.' })
      @ApiParam({ name: 'id', description: 'ID del retiro'     ,example: '123e4567-e89b-12d3-a456-426614174000',})
      update(@Param('id') id: string, @Body() updateRetiroDto: UpdateRetiroDto) {
          return this.retiroService.update(id, updateRetiroDto);
      }
  
      @AuthorizedRoles()
      @Delete(':id')
      @ApiOperation({ summary: 'Eliminar un retiro (soft delete)' })
      @ApiResponse({ status: 200, description: 'Retiro desactivado' })
      @ApiResponse({ status: 404, description: 'Retiro no encontrado o ya desactivada.' })
      @ApiParam({ name: 'id', description: 'ID del retiro',   example: '123e4567-e89b-12d3-a456-426614174000',})
      remove(@Param('id') id: string) {
          return this.retiroService.softDelete(id);
      }
}