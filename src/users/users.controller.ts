import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService )
    {}
 

    findAll()
    
    {
        const records = this.userService.findAll();
        return records

    }      
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
}

@Post()
create(@Body() body: CreateUserDto) {
    const response =  this.userService.create(body);
    if (response===null)
    {
        return "El Role no fue encontrado"
    }
    return response;
}

 
@Patch(':id')
 update(@Param('id') id: number, @Body() body)
 {
     
 return this.userService.update(id,body);
}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
destroy(@Param('id') id: number)
{
return  this.userService.remove(id);
}

}
