import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import CreateMedicamentoDto from './dtos/create-medicamento.dto';

@Controller('medicamentos')
export class MedicamentosController {
    constructor(
        private readonly medicamentosService: MedicamentosService
    ) {}

    @Get()
    findAll() {
        const records = this.medicamentosService.findAll();
        return records;
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.medicamentosService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateMedicamentoDto) {
        return this.medicamentosService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.medicamentosService.update(+id, body);
    }

    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.medicamentosService.remove(id);
    }

}
