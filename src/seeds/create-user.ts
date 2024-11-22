import { DataSource } from 'typeorm';
import User from '../users/entities/user.entity';
import Role from '../users/entities/role.entity';
import * as bcrypt from 'bcrypt';
import Departamento from 'src/departamentos/entities/departamento.entity';

export class CreateUsersSeed {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const departamentoRepository = dataSource.getRepository(Departamento);

    // Obtén los roles
    const farmaciaRole = await roleRepository.findOneBy({ name: 'Farmacia' });
    const bodegaRole = await roleRepository.findOneBy({ name: 'Bodega' });
    const odontologiaRole = await roleRepository.findOneBy({ name: 'Odontología' });
    const nutricionRole = await roleRepository.findOneBy({ name: 'Nutrición' });
    const medicosRole = await roleRepository.findOneBy({ name: 'Médicos' });
    const enfermeriaRole = await roleRepository.findOneBy({ name: 'Enfermería' });
    const laboratorioRole = await roleRepository.findOneBy({ name: 'Laboratorio' });
    const direccionRole = await roleRepository.findOneBy({ name: 'Dirección' });
    const superAdminRole = await roleRepository.findOneBy({ name: 'SuperAdmin' });

    // Obtén departamentos específicos
    const departamentoFarmacia = await departamentoRepository.findOneBy({
      nombre: 'Farmacia',
    });
    const departamentoBodega = await departamentoRepository.findOneBy({
      nombre: 'Bodega',
    });
    const departamentoOdontologia = await departamentoRepository.findOneBy({
      nombre: 'Odontología',
    });
    const departamentoNutricion = await departamentoRepository.findOneBy({
      nombre: 'Nutrición',
    });
    const departamentoMedicos = await departamentoRepository.findOneBy({
      nombre: 'Médicos',
    });
    const departamentoEnfermeria = await departamentoRepository.findOneBy({
      nombre: 'Enfermería',
    });
    const departamentoLaboratorio = await departamentoRepository.findOneBy({
      nombre: 'Laboratorio',
    });
    const departamentoDireccion = await departamentoRepository.findOneBy({
      nombre: 'Dirección',
    });
    const departamentoAdmin = await departamentoRepository.findOneBy({
      nombre: 'Administración',
    });

    // Genera contraseñas para cada usuario
    const passwordFarmacia = await bcrypt.hash('farmaciahsptl24', 10);
    const passwordBodega = await bcrypt.hash('bodegahsptl24', 10);
    const passwordOdontologia = await bcrypt.hash('odontologiahsptl24', 10);
    const passwordNutricion = await bcrypt.hash('nutricionhsptl24', 10);
    const passwordMedicos = await bcrypt.hash('medicoshsptl24', 10);
    const passwordEnfermeria = await bcrypt.hash('enfermeriahsptl24', 10);
    const passwordLaboratorio = await bcrypt.hash('laboratoriohsptl24', 10);
    const passwordDireccion = await bcrypt.hash('direccionhsptl24', 10);
    const passwordSuperAdmin = await bcrypt.hash('superadminhsptl24', 10);

    // Usuarios para cada rol
    const users = [
      {
        name: 'Carlos',
        lastname: 'Farmacia',
        username: 'farmacia_user',
        email: 'farmacia_user@gmail.com',
        is_Active: true,
        role: farmaciaRole,
        departamento: departamentoFarmacia,
        password: passwordFarmacia,
      },
      {
        name: 'Juan',
        lastname: 'Bodega',
        username: 'bodega_user',
        email: 'bodega_user@gmail.com',
        is_Active: true,
        role: bodegaRole,
        departamento: departamentoBodega,
        password: passwordBodega,
      },
      {
        name: 'Ana',
        lastname: 'Odontología',
        username: 'odontologia_user',
        email: 'odontologia_user@gmail.com',
        is_Active: true,
        role: odontologiaRole,
        departamento: departamentoOdontologia,
        password: passwordOdontologia,
      },
      {
        name: 'Sofia',
        lastname: 'Nutrición',
        username: 'nutricion_user',
        email: 'nutricion_user@gmail.com',
        is_Active: true,
        role: nutricionRole,
        departamento: departamentoNutricion,
        password: passwordNutricion,
      },
      {
        name: 'Maritza',
        lastname: 'Castañeda',
        username: 'MaritzaC',
        email: 'maritzac@gmail.com',
        is_Active: true,
        role: medicosRole,
        departamento: departamentoMedicos,
        password: passwordMedicos,
      },
      {
        name: 'Carla',
        lastname: 'Enfermería',
        username: 'enfermeria_user',
        email: 'enfermeria_user@gmail.com',
        is_Active: true,
        role: enfermeriaRole,
        departamento: departamentoEnfermeria,
        password: passwordEnfermeria,
      },
      {
        name: 'Miguel',
        lastname: 'Laboratorio',
        username: 'laboratorio_user',
        email: 'laboratorio_user@gmail.com',
        is_Active: true,
        role: laboratorioRole,
        departamento: departamentoLaboratorio,
        password: passwordLaboratorio,
      },
      {
        name: 'Diana',
        lastname: 'Dirección',
        username: 'direccion_user',
        email: 'direccion_user@gmail.com',
        is_Active: true,
        role: direccionRole,
        departamento: departamentoDireccion,
        password: passwordDireccion,
      },
      {
        name: 'Super',
        lastname: 'Admin',
        username: 'superadmin',
        email: 'superadmin@gmail.com',
        is_Active: true,
        role: superAdminRole,
        departamento: departamentoAdmin,
        password: passwordSuperAdmin,
      },
    ];

    // Guarda los usuarios
    await userRepository.save(users);
  }
}
