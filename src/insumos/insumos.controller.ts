import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import CreateInsumoDto from './dtos/create-insumo.dto';
import UpdateInsumoDto from './dtos/update-insumo.dto';

@Controller('insumos')
export class InsumosController {
    constructor(
        private readonly insumosService: InsumosService
    ) {}

    @Get()
    findAll() {
        return this.insumosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.insumosService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateInsumoDto) {
        return this.insumosService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() body: UpdateInsumoDto) {
        return this.insumosService.update(id, body);
    }

    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.insumosService.remove(id);
    }
}
