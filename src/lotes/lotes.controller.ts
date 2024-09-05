import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LotesService } from './lotes.service';
import CreateLoteDto from './dtos/create-lote.dto';
import UpdateLoteDto from './dtos/update-lote.dto';

@Controller('lotes')
export class LotesController {
    constructor(
        private readonly lotesService: LotesService
    ) {}

    @Get()
    findAll() {
        return this.lotesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.lotesService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateLoteDto) {
        return this.lotesService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() body: UpdateLoteDto) {
        return this.lotesService.update(id, body);
    }

    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.lotesService.remove(id);
    }
}
