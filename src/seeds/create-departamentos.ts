import Departamento from 'src/departamentos/entities/departamento.entity';
import { DataSource } from 'typeorm';

export class CreateDepartamentoSeed {
  async run(dataSource: DataSource): Promise<void> {
    const departamentoRepository = dataSource.getRepository(Departamento);

    const departamento = [
      { nombre: 'Medicina General' },
      { nombre: 'Enfermería' },
      { nombre: 'Pediatría' },
      { nombre: 'Urgencias' },
      { nombre: 'Cirugía' },
      { nombre: 'Traumatología' },
      { nombre: 'Farmacia' },
      { nombre: 'Laboratorio' },
    ];

    await departamentoRepository.save(departamento);
  }
}
