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
import CreateRoleDto from '../dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import Role from '../entities/role.entity';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Get()
  @ApiCreatedResponse({ 
    description: 'Este endpoint sirve para retornar todos los roles existentes', 
    }
    )
  findAll()
  
  {
    const records = this.rolesService.findAll();
    return records;
  }

  @Get(':id')
  @ApiCreatedResponse({ 
    description: 'Este endpoint sirve para retornar un role existente', 
    }
    )
  findOne(@Param('id') id: number) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ 
    description: 'Este endpoint sirve para crear nuevos Roles', 
    type: Role}
    )
  create(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body);
  }

  @Patch(':id')
  @ApiCreatedResponse({ 
    description: 'Este endpoint sirve para actualizar un role existente', 
    }
    )
  update(@Param('id') id: number, @Body() body) {
    return this.rolesService.update(id, body);
  }

  @Delete(':id')
  @ApiCreatedResponse({ 
    description: 'Este endpoint sirve para eliminar un role existente', 
    }
    )
  @HttpCode(HttpStatus.NO_CONTENT)
  destroy(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}
