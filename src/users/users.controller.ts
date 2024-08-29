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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import User from './entities/user.entity';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import QueryUserDto from './dto/query-user.dto';
import UpdateUserDto from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @AuthorizedRoles()
  @Get()
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para devolver todos los usarios que estan activos',
  })
  findAll(@Query() query: QueryUserDto) {
    console.log(query)
    const records = this.userService.findAll(query);
    return records;
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiCreatedResponse({
    description:
      'Este endpoint sirve para encontrar un usuario por medio del ID',
  })
  findOne(@Param('id') id: string) {
    console.log(id)
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
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
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
