import Role from '../users/entities/role.entity';
import { DataSource } from 'typeorm';

export class CreateRolesSeed {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = [
      { name: 'Farmacia' },
      { name: 'Bodega' },
      { name: 'Odontología' },
      { name: 'Nutrición' },
      { name: 'Médicos' },
      { name: 'Enfermería' },
      { name: 'Laboratorio' },
      { name: 'Dirección' },
      { name: 'SuperAdmin' },
    ];

    await roleRepository.save(roles);
  }
}
