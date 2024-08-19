import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import CreateRoleDto from '../dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService )
    {}
    @Get()
    findAll()
    {
        const records = this.rolesService.findAll();
        return records

    }      

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.rolesService.findOne(id);
}

@Post()
create(@Body() body: CreateRoleDto) {
 return this.rolesService.create(body);
}


@Patch(':id')

 update(@Param('id') id: number, @Body() body)
 {
     
 return this.rolesService.update(id,body);
}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
destroy(@Param('id') id: number)
{
return  this.rolesService.remove(id);
}

}
