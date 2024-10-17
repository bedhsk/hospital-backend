import Categoria from 'src/categorias/entities/categoria.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import { DataSource } from 'typeorm';

export class CreateInsumoSeed {
  async run(dataSource: DataSource): Promise<void> {
    const insumoRepository = dataSource.getRepository(Insumo);
    const categoriaRepository = dataSource.getRepository(Categoria);
    
    const categoriaGeneral = await categoriaRepository.findOneBy({ nombre: 'General' });
    const categoriaMicronutrientes = await categoriaRepository.findOneBy({ nombre: 'Micronutrientes y Alimentos Complementarios' });
    const categoriaMetodosPlanificacionFamiliar = await categoriaRepository.findOneBy({ nombre: 'Métodos de Planificación Familiar' });
    const categoriaMedicamentosAntimalaricos = await categoriaRepository.findOneBy({ nombre: 'Medicamentos Antimaláricos' });
    const categoriaMedicamentosAntifimios = await categoriaRepository.findOneBy({ nombre: 'Medicamentos Antifímicos' });
    const categoriaMedicamentosAntirretrovirales = await categoriaRepository.findOneBy({ nombre: 'Medicamentos Antirretrovirales' });

    const insumo = [
      { codigo: '123456789012', nombre: 'Acetaminofen (Paracetamol), Solución oral, 100mg/1mL, Gotero', categoria: categoriaGeneral},
      { codigo: '123456789013', nombre: 'Alimento Terapéutico, Sobre 92 g', categoria: categoriaMicronutrientes},
      { codigo: '123456789014', nombre: 'Levonorgestrel 75 mg, Implante', categoria: categoriaMetodosPlanificacionFamiliar},
      { codigo: '123456789015', nombre: 'Cloroquina, Tableta 250 mg', categoria: categoriaMedicamentosAntimalaricos},
      { codigo: '123456789016', nombre: 'Bedaquilina 100mg, Tableta', categoria: categoriaMedicamentosAntifimios},
      { codigo: '123456789017', nombre: 'Raltegravir 400 mg, Tableta', categoria: categoriaMedicamentosAntirretrovirales},
    ];

    await insumoRepository.save(insumo);
  }
}