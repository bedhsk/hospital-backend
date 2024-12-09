import Role from '../users/entities/role.entity';
import { DataSource } from 'typeorm';

export class CreateRolesSeed {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = [
      { name: 'Farmacia' },
      { name: 'Bodega' },
      { name: 'Odontologia' },
      { name: 'Nutricion' },
      { name: 'Medicos' },
      { name: 'Enfermeria' },
      { name: 'Laboratorio' },
      { name: 'Direccion' },
      { name: 'SuperAdmin' },
    ];

    await roleRepository.save(roles);
  }
}
