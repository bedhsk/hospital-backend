import Categoria from 'src/categorias/entities/categoria.entity';
import { DataSource } from 'typeorm';

export class CreateCategoriaSeed {
  async run(dataSource: DataSource): Promise<void> {
    const categoriaRepository = dataSource.getRepository(Categoria);

    const categoria = [
      { nombre: 'General' },
      { nombre: 'Micronutrientes y Alimentos Complementarios' },
      { nombre: 'Métodos de Planificación Familiar' },
      { nombre: 'Medicamentos Antimaláricos' },
      { nombre: 'Medicamentos Antifímicos' },
      { nombre: 'Medicamentos Antirretrovirales' },
    ];

    await categoriaRepository.save(categoria);
  }
}
