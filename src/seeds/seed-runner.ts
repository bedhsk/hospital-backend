import 'module-alias/register';
import { dataSource } from '../../typeorm.config';
import { CreateRolesSeed } from './create-role';
import { CreateUsersSeed } from './create-user';
import { CreateInsumoSeed } from './create-insumo';
import { CreateDepartamentoSeed } from './create-departamentos';
import { CreateInsumoDepartamentoSeed } from './create-insumo_departamentos';
import { CreateCategoriaSeed } from './create-categoria';
import { CreatePacienteSeed } from './create-paciente';

async function runSeeds() {
  await dataSource.initialize();

  const createRolesSeed = new CreateRolesSeed();
  await createRolesSeed.run(dataSource);

  const createDepartamentoSeed = new CreateDepartamentoSeed();
  await createDepartamentoSeed.run(dataSource);

  const createUsersSeed = new CreateUsersSeed();
  await createUsersSeed.run(dataSource);

  const createCategoriaSeed = new CreateCategoriaSeed();
  await createCategoriaSeed.run(dataSource);

  const createInsumoSeed = new CreateInsumoSeed();
  await createInsumoSeed.run(dataSource);

  // const createInsumoDepartamentoSeed = new CreateInsumoDepartamentoSeed();
  // await createInsumoDepartamentoSeed.run(dataSource);

  const createPacienteSeed = new CreatePacienteSeed();
  await createPacienteSeed.run(dataSource);

  await dataSource.destroy();
}

runSeeds()
  .then(() => {
    console.log('Seeds ejecutados correctamente');
  })
  .catch((error) => {
    console.error('Error ejecutando los seeds:', error);
  });
