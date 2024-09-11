import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import CreateRoleDto from '../dto/create-role.dto';
import { RolesService } from './roles.service';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import UpdateRoleDto from '../dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  /**
   * Obtiene todos los roles existentes.
   */
  @AuthorizedRoles() // Roles permitidos
  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los roles',
    description: 'Este endpoint sirve para retornar todos los roles existentes en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles obtenidos exitosamente.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
          },
          name: {
            type: 'string',
            example: 'Doctor',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll() {
    const records = this.rolesService.findAll();
    return records;
  }

  /**
   * Obtiene un rol específico por su ID.
   */
  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un rol por su ID',
    description: 'Este endpoint sirve para retornar un rol existente por su ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol obtenido exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        name: {
          type: 'string',
          example: 'Admin',
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  /**
   * Crea un nuevo rol.
   */
  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crea un nuevo rol',
    description: 'Este endpoint sirve para crear nuevos roles en el sistema.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un rol.',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        name: {
          type: 'string',
          example: 'Admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos.',
  })
  create(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body);
  }

  /**
   * Actualiza un rol existente por su ID.
   */
  @AuthorizedRoles()
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualiza un rol existente',
    description: 'Este endpoint sirve para actualizar un rol existente por su ID.',
  })
  @ApiBody({
    description: 'Datos necesarios para actualizar un rol.',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Doctor',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        name: {
          type: 'string',
          example: 'Doctor',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado.',
  })
  update(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    return this.rolesService.update(id, body);
  }

  /**
   * Elimina un rol existente por su ID.
   */
  @AuthorizedRoles()
  @Delete(':id')
  @ApiOperation({
    summary: 'Elimina un rol existente',
    description: 'Este endpoint sirve para eliminar un rol existente por su ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'Rol eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  destroy(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
