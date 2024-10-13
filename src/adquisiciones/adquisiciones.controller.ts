import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdquisicionesService } from './adquisiciones.service';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateAdquisicionDto from './dtos/create-adquisicion.dto';
import UpdateAdquisicionDto from './dtos/update-adquisicion.dto';
import QueryAdquisicionDto from './dtos/query-adquisicion.dto';

@ApiTags('Adquisiciones y detalleAdquisicion')
@Controller('adquisiciones')
export class AdquisicionesController {
  constructor(
    private readonly adquisicionService: AdquisicionesService,
  ) {}

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crear nueva adquisicion',
    description: 'Este endpoint sirve para crear nuevas adquisiciones',
  })
  @ApiBody({
    description: 'Datos de la adquisición a crear',
    schema: {
      type: 'object',
      properties: {
        usuarioId: {
          type: 'string',
          example: '4b343f3e-0b6d-4182-b9c9-18fa7175588d',
        },
        descripcion: {
          type: 'string',
          example: 'Prueba de adquisicion',
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
  @ApiResponse({
    status: 201,
    description: 'La adquisición y el detalle han sido creados exitosamente',
    schema: {
      type: 'object',
      properties: {
        adquisicion: {
          type: 'object',
          properties: {
            descripcion: {
              type: 'string',
              example: 'Prueba de adquisicion',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
            usuario: {
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
              type: 'string',
              format: 'date-time',
              example: '2024-10-01T01:46:28.654Z',
            },
          },
        },
        detalleAdquisicion: {
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
            adquisicion: {
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
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, revisa los campos enviados',
  })
  create(@Body() createAdquisicionDto: CreateAdquisicionDto) {
    return this.adquisicionService.create(createAdquisicionDto);
  }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Obtiene todas las adquisiciones',
    description:
      'Este endpoint sirve para retornar todos los insumos activos en la base de datos.',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
    description: 'Nombre del usuario para filtrar.',
    example: 'admin',
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
    description: 'Filtro por nombre del departamento.',
    example: 'departamento1',
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
    description: 'Adquisiciones con su detalle y departamento obtenidas exitosamente.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'bdda2e12-acae-4c14-8ca3-f009715a2012',
                description: 'ID de la adquisición'
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-10-01T05:19:07.624Z',
                description: 'Fecha de creación de la adquisición'
              },
              descripcion: {
                type: 'string',
                example: 'Prueba de actualización',
                description: 'Descripción de la adquisición'
              },
              is_active: {
                type: 'boolean',
                example: true,
                description: 'Indica si la adquisición está activa'
              },
              usuario: {
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
                    description: 'Nombre de usuario del responsable de la adquisición'
                  }
                }
              },
              detalleAdquisicion: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: '18198df1-8a64-409c-9acb-1432cc173864',
                      description: 'ID del detalle de adquisición'
                    },
                    cantidad: {
                      type: 'number',
                      example: 20,
                      description: 'Cantidad adquirida del insumo'
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
          description: 'Número total de adquisiciones'
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
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll(@Query() query: QueryAdquisicionDto) {
    return this.adquisicionService.findAll(query);
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar una adquisicion por ID',
    description:
      'Este endpoint sirve para buscar una adquisicion por su ID, si está activo',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la adquisicion a buscar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la adquisicion activa',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'bdda2e12-acae-4c14-8ca3-f009715a2012',
          description: 'ID de la adquisición'
        },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-10-01T05:19:07.624Z',
          description: 'Fecha de creación de la adquisición'
        },
        descripcion: {
          type: 'string',
          example: 'Prueba de actualización',
          description: 'Descripción de la adquisición'
        },
        is_active: {
          type: 'boolean',
          example: true,
          description: 'Indica si la adquisición está activa'
        },
        usuario: {
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
              description: 'Nombre de usuario del responsable de la adquisición'
            }
          }
        },
        detalleAdquisicion: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '18198df1-8a64-409c-9acb-1432cc173864',
                description: 'ID del detalle de adquisición'
              },
              cantidad: {
                type: 'number',
                example: 20,
                description: 'Cantidad adquirida del insumo'
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
  @ApiResponse({
    status: 404,
    description: 'Insumo no encontrado o desactivado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  findOne(@Param('id') id: string) {
    return this.adquisicionService.findOne(id);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Actualizar una adquisicion',
    description: 'Este endpoint sirve para actualizar una adquisicion existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la adquisicion a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Datos de la adquisicion a actualizar',
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
  @ApiResponse({
    status: 201,
    description: 'El insumo ha sido actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdquisicionDto: UpdateAdquisicionDto) {
    return this.adquisicionService.update(id, updateAdquisicionDto);
  }

  @AuthorizedRoles()
  @ApiOperation({
    summary: 'Eliminar (soft delete) una adquisicion',
    description:
      'Este endpoint sirve para eliminar una adquisicion y su detalle sin borrarlo físicamente de la base de datos',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la adquisicion a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Adquisicion y detalleAdquisicion desactivados exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquisicion y/o detalleAdquisicion no encontrado o ya desactivado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adquisicionService.softDelete(id);
  }
}