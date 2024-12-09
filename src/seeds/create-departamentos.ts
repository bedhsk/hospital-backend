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
      { nombre: 'Enfermeria' },
      { nombre: 'Laboratorio' },
      { nombre: 'Traumatología' },
      { nombre: 'Administración' },
      { nombre: 'Medicina General' },
      { nombre: 'Bodega' },
    ];

    await departamentoRepository.save(departamento);
  }
}
