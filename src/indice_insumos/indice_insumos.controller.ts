import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import CreateIndiceInsumoDto from './dtos/create-indice-insumo.dto';
import UpdateIndiceInsumoDto from './dtos/update-indice-insumo.dto';
import { IndiceInsumosService } from './indice_insumos.service';

@Controller('indice-insumos')
export class IndiceInsumosController {
    constructor(
        private readonly indiceInsumosService: IndiceInsumosService
    ) {}

    @Get()
    findAll() {
        return this.indiceInsumosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.indiceInsumosService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateIndiceInsumoDto) {
        return this.indiceInsumosService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() body: UpdateIndiceInsumoDto) {
        return this.indiceInsumosService.update(id, body);
    }

    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.indiceInsumosService.remove(id);
    }
}
