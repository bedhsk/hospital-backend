import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import CreateMovimientoInsumoDto from './dtos/create-movimiento-insumo.dto';
import UpdateMovimientoInsumoDto from './dtos/update-movimiento-insumo.dto';
import { MovimientoInsumosService } from './movimiento_insumos.service';

@Controller('movimiento-insumos')
export class MovimientoInsumosController {
    constructor(
        private readonly movimientoInsumosService: MovimientoInsumosService
    ) {}

    @Get()
    findAll() {
        return this.movimientoInsumosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.movimientoInsumosService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateMovimientoInsumoDto) {
        return this.movimientoInsumosService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() body: UpdateMovimientoInsumoDto) {
        return this.movimientoInsumosService.update(id, body);
    }

    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.movimientoInsumosService.remove(id);
    }
}
