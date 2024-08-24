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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import User from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para devolver todos los usarios que estan activos',
  })
  findAll() {
    const records = this.userService.findAll();
    return records;
  }

  @Get(':id')
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para encontrar un usuario por medio del ID',
  })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

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

  @Patch(':id')
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para actualizar datos de los usarios existentes',
  })
  update(@Param('id') id: number, @Body() body) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para poner un usuario en estado desactivado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
