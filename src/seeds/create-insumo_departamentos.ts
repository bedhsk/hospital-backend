import Departamento from 'src/departamentos/entities/departamento.entity';
import { InsumoDepartamento } from 'src/insumo_departamentos/entities/insumo_departamento.entity';
import Insumo from 'src/insumos/entities/insumo.entity';
import { DataSource } from 'typeorm';

export class CreateInsumoDepartamentoSeed {
  async run(dataSource: DataSource): Promise<void> {
    const insumodepartamentoRepository = dataSource.getRepository(InsumoDepartamento);
    const insumoRepository = dataSource.getRepository(Insumo);
    const departamentoRepository = dataSource.getRepository(Departamento);
    
    const dep1 = await departamentoRepository.findOneBy({ nombre: 'Deparatamento1' });
    const dep2 = await departamentoRepository.findOneBy({ nombre: 'Deparatamento2' });

    const insumo1 = await insumoRepository.findOneBy({ nombre: 'Insumo1' });
    const insumo2 = await insumoRepository.findOneBy({ nombre: 'Insumo2' });

    const insumodepartamento = [
      { insumoId: insumo1, departamentoId: dep1,  existencia:2000},
      { insumoId: insumo2, departamentoId: dep2,  existencia:2000},
      { insumoId: insumo1, departamentoId: dep2,  existencia:1000},
      { insumoId: insumo2, departamentoId: dep1,  existencia:1000},
    ];

    await insumodepartamentoRepository.save(insumodepartamento);
  }
}