import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local.guard';
import { Request } from 'express';
import User from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IsPublic } from 'src/common/is-public.decorator';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('Login')
export class AuthController {
  constructor(private readonly jwtService: JwtService) { }

  @Post('login')
  @IsPublic()
  @UseGuards(LocalGuard)
  @ApiOperation({
    summary: 'Inicia sesión un usuario',
    description: 'Este endpoint permite a los usuarios autenticarse en la aplicación proporcionando sus credenciales. Si la autenticación es exitosa, se devuelve un token JWT que puede ser utilizado para acceder a rutas protegidas.',
  })
  @ApiBody({
    description: 'Credenciales de inicio de sesión del usuario',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'admin',
          description: 'El nombre de usuario del empleado que desea iniciar sesión.'
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'La contraseña del empleado.'
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso. El usuario recibe un token JWT.',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'El token JWT que permite al usuario acceder a rutas protegidas.'
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas. No se pudo autenticar al usuario.',
  })
  async login(@Req() request: Request) {
    const user = request.user as User;
    const payload = {
      sub: user.id,
      name: `${user.name} ${user.lastname}`,
      iat: new Date().getTime(),
      role: user.role?.name,
    }

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
