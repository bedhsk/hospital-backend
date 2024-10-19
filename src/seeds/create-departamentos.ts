import Departamento from 'src/departamentos/entities/departamento.entity';
import { DataSource } from 'typeorm';

export class CreateDepartamentoSeed {
  async run(dataSource: DataSource): Promise<void> {
    const departamentoRepository = dataSource.getRepository(Departamento);

    const departamento = [
      { nombre: 'Cirugía' },
      { nombre: 'Farmacia' },
      { nombre: 'Pediatría' },
      { nombre: 'Urgencias' },
      { nombre: 'Enfermería' },
      { nombre: 'Laboratorio' },
      { nombre: 'Traumatología' },
      { nombre: 'Medicina General' },
    ];

    await departamentoRepository.save(departamento);
  }
}
