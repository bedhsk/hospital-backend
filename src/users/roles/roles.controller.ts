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
import CreateRoleDto from '../dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import Role from '../entities/role.entity';
import { AuthorizedRoles } from 'src/common/has-role.decoretor';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { IsPublic } from 'src/common/is-public.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  /**
   * Si esta vacio quiere decir que solo permite roles de ADMIN y GERENTE,
   * Si se desea enviar un Rol o mas roles para poder acceder a estos se
   * debe de enviar de la siguiente manera ['Doctor', 'Enfermera']
   */
  @AuthorizedRoles() // Roles permitidos
  @Get()
  @ApiCreatedResponse({
    description: 'Este endpoint sirve para retornar todos los roles existentes',
  })
  findAll() {
    const records = this.rolesService.findAll();
    return records;
  }

  @AuthorizedRoles()
  @Get(':id')
  @ApiCreatedResponse({
    description: 'Este endpoint sirve para retornar un role existente',
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @AuthorizedRoles()
  @Post()
  @ApiCreatedResponse({
    description: 'Este endpoint sirve para crear nuevos Roles',
    type: Role,
  })
  create(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body);
  }

  @AuthorizedRoles()
  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Este endpoint sirve para actualizar un role existente',
  })
  update(@Param('id') id: string, @Body() body) {
    return this.rolesService.update(id, body);
  }

  @AuthorizedRoles()
  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Este endpoint sirve para eliminar un role existente',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  destroy(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
