import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { InsumoDepartamentoService } from './insumo_departamentos.service';
import CreateInsumoDepartamentoDto from './dtos/create-insumo_departamento.dto';
import UpdateInsumoDepartamentoDto from './dtos/update-insumo_departamento.dto';

@Controller('insumo-departamento')
export class InsumoDepartamentoController {
  constructor(private readonly insumoDepartamentoService: InsumoDepartamentoService) {}

  @Get()
  findAll() {
    return this.insumoDepartamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insumoDepartamentoService.findOne(id);
  }

  @Post()
  create(@Body() createInsumoDepartamentoDto: CreateInsumoDepartamentoDto) {
    return this.insumoDepartamentoService.create(createInsumoDepartamentoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsumoDepartamentoDto: UpdateInsumoDepartamentoDto) {
    return this.insumoDepartamentoService.update(id, updateInsumoDepartamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insumoDepartamentoService.remove(id);
  }
}
