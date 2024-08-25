import { SetMetadata } from '@nestjs/common';

export const AuthorizedRoles = (rolesName: string[] = ['Admin', 'Gerente']) => SetMetadata('roles', rolesName);