import Role from '../users/entities/role.entity';
import { DataSource } from 'typeorm';

export class CreateRolesSeed {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = [
      { name: 'Admin' },
      { name: 'Gerente' },
      { name: 'Doctor' },
      { name: 'Enfermera' },
      { name: 'Bodeguero' },
      { name: 'Labotarista' },
    ];

    await roleRepository.save(roles);
  }
}