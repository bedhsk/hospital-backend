import Departamento from 'src/departamentos/entities/departamento.entity';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import { DataSource } from 'typeorm';

export class CreateInsumoDepartamentoSeed {
  async run(dataSource: DataSource): Promise<void> {
    const insumodepartamentoRepository = dataSource.getRepository(InsumoDepartamento);
    const insumoRepository = dataSource.getRepository(Insumo);
    const departamentoRepository = dataSource.getRepository(Departamento);
    
    const medicinaGeneral = await departamentoRepository.findOneBy({ nombre: 'Medicina General' });
    const farmacia = await departamentoRepository.findOneBy({ nombre: 'Farmacia' });

    const insumo1 = await insumoRepository.findOneBy({ nombre: 'Levonorgestrel 75 mg, Implante' });
    const insumo2 = await insumoRepository.findOneBy({ nombre: 'Acetaminofen (Paracetamol), Solución oral, 100mg/1mL, Gotero' });

    const insumodepartamento = [
      { insumo: insumo1, departamento: medicinaGeneral,  existencia:200},
      { insumo: insumo2, departamento: medicinaGeneral,  existencia:200},
      { insumo: insumo2, departamento: farmacia,  existencia:200},
      { insumo: insumo1, departamento: farmacia,  existencia:200},
    ];

    await insumodepartamentoRepository.save(insumodepartamento);
  }
}