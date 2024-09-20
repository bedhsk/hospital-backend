import 'module-alias/register';
import { dataSource } from '../../typeorm.config';
import { CreateRolesSeed } from './create-role';
import { CreateUsersSeed } from './create-user';

async function runSeeds() {
  await dataSource.initialize();

  const createRolesSeed = new CreateRolesSeed();
  await createRolesSeed.run(dataSource);

  const createUsersSeed = new CreateUsersSeed();
  await createUsersSeed.run(dataSource);

  await dataSource.destroy();
}

runSeeds()
  .then(() => {
    console.log('Seeds ejecutados correctamente');
  })
  .catch((error) => {
    console.error('Error ejecutando los seeds:', error);
  });
