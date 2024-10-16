
import Departamento from 'src/departamentos/entities/departamento.entity';
import { DataSource } from 'typeorm';

export class CreateDepartamentoSeed {
  async run(dataSource: DataSource): Promise<void> {
    const departamentoRepository = dataSource.getRepository(Departamento);

    const departamento = [
      { nombre: 'Deparatamento1' },
      { nombre: 'Deparatamento2' },
      { nombre: 'Deparatamento3' },
      { nombre: 'Deparatamento4' },

    ];

    await departamentoRepository.save(departamento);
  }
}