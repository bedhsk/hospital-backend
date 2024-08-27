import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IndiceMedicamentosService } from './indice_medicamentos.service';
import CreateIndiceMedicamentoDto from './dtos/create-indice-medicamento.dto';

@Controller('indice-medicamentos')
export class IndiceMedicamentosController {
    constructor(
        private readonly indiceMedicamentosService: IndiceMedicamentosService
    ) {}
    
    @Get()
    findAll() {
        const records = this.indiceMedicamentosService.findAll();
        return records;
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.indiceMedicamentosService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateIndiceMedicamentoDto) {
        return this.indiceMedicamentosService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.indiceMedicamentosService.update(+id, body);
    }

    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.indiceMedicamentosService.remove(id);
    }
}
