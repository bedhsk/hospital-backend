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
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryUserDto from './dto/query-user.dto';
import UpdateUserDto from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @AuthorizedRoles()
  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los usuarios',
    description: 'Este endpoint sirve para retornar todos los usuarios existentes en la base de datos.',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Nombre del usuario para filtrar.',
    example: 'Maria',
  })
  @ApiQuery({
    name: 'role',
    type: String,
    required: false,
    description: 'Rol del usuario para filtrar.',
    example: 'Admin',
  })
  @ApiQuery({
    name: 'currentPage',
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
    description: 'Usuarios obtenidos exitosamente.',
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
            example: 'Maria',
          },
          lastname: {
            type: 'string',
            example: 'Perez',
          },
          username: {
            type: 'string',
            example: 'maperez',
          },
          email: {
            type: 'string',
            example: 'mariap@gmail.com',
          },
          createdAt: {
            type: 'string',
            example: '2024-08-29T01:38:11.779Z',
          },
          updatedAt: {
            type: 'string',
            example: '2024-08-29T01:38:11.779Z',
          },
          role: {
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
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findAll(@Query() query: QueryUserDto) {
    console.log(query)
    const records = this.userService.findAll(query);
    return records;
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un usuario por ID',
    description: 'Este endpoint sirve para encontrar un usuario por medio del ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del usuario que se desea obtener.',
    example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        name: {
          type: 'string',
          example: 'Maria',
        },
        lastname: {
          type: 'string',
          example: 'Perez',
        },
        username: {
          type: 'string',
          example: 'maperez',
        },
        email: {
          type: 'string',
          example: 'mariap@gmail.com',
        },
        createdAt: {
          type: 'string',
          example: '2024-08-29T01:38:11.779Z',
        },
        updatedAt: {
          type: 'string',
          example: '2024-08-29T01:38:11.779Z',
        },
        role: {
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
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  findOne(@Param('id') id: string) {
    console.log(id)
    return this.userService.findOne(id);
  }

  @AuthorizedRoles()
  @Post()
  @ApiOperation({
    summary: 'Crea un nuevo usuario',
    description: 'Este endpoint sirve para crear nuevos usuarios en la base de datos.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo usuario.',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Maria',
        },
        lastname: {
          type: 'string',
          example: 'Perez',
        },
        username: {
          type: 'string',
          example: 'maperez',
        },
        email: {
          type: 'string',
          example: 'mariap@gmail.com',
        },
        password: {
          type: 'string',
          example: 'mariaadmin24',
        },
        roleId: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc'
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        name: {
          type: 'string',
          example: 'Maria',
        },
        lastname: {
          type: 'string',
          example: 'Perez',
        },
        username: {
          type: 'string',
          example: 'maperez',
        },
        email: {
          type: 'string',
          example: 'mariap@gmail.com',
        },
        createdAt: {
          type: 'string',
          example: '2024-08-29T01:38:11.779Z',
        },
        updatedAt: {
          type: 'string',
          example: '2024-08-29T01:38:11.779Z',
        },
        is_Active:{
          type: 'boolean',
          example: 'true'
        },
        role: {
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
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta. Puede ser que el rol no se haya encontrado.',
  })
  create(@Body() body: CreateUserDto) {
    const response = this.userService.create(body);
    if (response === null) {
      return 'El Role no fue encontrado';
    }
    return response;
  }

  @AuthorizedRoles()
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualiza un usuario existente',
    description: 'Este endpoint sirve para actualizar los datos de un usuario existente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del usuario que se desea actualizar.',
    example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
  })
  @ApiBody({
    description: 'Cualquiera de estos datos son aceptados para actualizar el usuario',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Maria',
        },
        lastname: {
          type: 'string',
          example: 'Perez',
        },
        username: {
          type: 'string',
          example: 'maperez',
        },
        email: {
          type: 'string',
          example: 'mariap@gmail.com',
        },
        password: {
          type: 'string',
          example: 'mariaadmin24',
        },
        roleId: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc'
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario actualizado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
        },
        name: {
          type: 'string',
          example: 'Maria',
        },
        lastname: {
          type: 'string',
          example: 'Perez',
        },
        username: {
          type: 'string',
          example: 'maperez',
        },
        email: {
          type: 'string',
          example: 'mariap@gmail.com',
        },
        createdAt: {
          type: 'string',
          example: '2024-08-29T01:38:11.779Z',
        },
        updatedAt: {
          type: 'string',
          example: '2024-08-29T01:38:11.779Z',
        },
        is_Active:{
          type: 'boolean',
          example: 'true'
        },
        role: {
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
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta. Puede ser que el rol no se haya encontrado o los datos son inválidos.',
  })
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @AuthorizedRoles()
  @Delete(':id')
  @ApiOperation({
    summary: 'Elimina (desactiva) un usuario',
    description: 'Este endpoint sirve para eliminar (o desactivar) un usuario existente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del usuario que se desea eliminar.',
    example: '59271b3e-e4ca-4434-8064-048a094ec8dc',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuario desactivado exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
