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
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import User from './entities/user.entity';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import Role from './entities/role.entity';
import { IsPublic } from 'src/common/is-public.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @AuthorizedRoles()
  @Get()
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para devolver todos los usarios que estan activos',
  })
  findAll() {
    const records = this.userService.findAll();
    return records;
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para encontrar un usuario por medio del ID',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @AuthorizedRoles()
  @Post()
  @ApiCreatedResponse({
    description: 'Este endpoint sirve para crear nuevos usuarios',
    type: User,
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
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para actualizar datos de los usarios existentes',
  })
  update(@Param('id') id: string, @Body() body) {
    return this.userService.update(id, body);
  }

  @AuthorizedRoles()
  @Delete(':id')
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para poner un usuario en estado desactivado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
