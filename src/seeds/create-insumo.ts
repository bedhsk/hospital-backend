import Insumo from 'src/insumos/entities/insumo.entity';
import { DataSource } from 'typeorm';

export class CreateInsumoSeed {
  async run(dataSource: DataSource): Promise<void> {
    const insumoRepository = dataSource.getRepository(Insumo);

    const insumo = [
      { codigo: '123456789012', nombre: 'Insumo1', categoriaId: 'Categoria 1'},
      { codigo: '123456789013', nombre: 'Insumo2', categoriaId: 'Categoria 2'},
      { codigo: '123456789014', nombre: 'Insumo3', categoriaId: 'Categoria 3'},
      { codigo: '123456789015', nombre: 'Insumo4', categoriaId: 'Categoria 4'},
    ];

    await insumoRepository.save(insumo);
  }
}