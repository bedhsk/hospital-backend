import { DataSource } from 'typeorm';
import User from '../users/entities/user.entity';
import Role from '../users/entities/role.entity';
import * as bcrypt from 'bcrypt';

export class CreateUsersSeed {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    const adminRole = await roleRepository.findOneBy({ name: 'Admin' });
    const doctorRole = await roleRepository.findOneBy({ name: 'Doctor' });

    const passwordAdminHash = await bcrypt.hash('admin.hospital24', 10);
    const passwordDoctorHash = await bcrypt.hash('admin.hospital24', 10);
    const users = [
      {
        name: 'Admin',
        lastname: 'Admin',
        username: 'Admin',
        email: 'Admin@example.com',
        is_Active: true,
        role: adminRole,
        password: passwordAdminHash, // Esta contraseña se hasheará automáticamente
      },
      {
        name: 'Maria',
        lastname: 'Lopez',
        username: 'mlopez',
        email: 'maria.lopez@example.com',
        is_Active: true,
        role: doctorRole,
        password: passwordDoctorHash, // Esta contraseña se hasheará automáticamente
      },
    ];

    await userRepository.save(users);
  }
}