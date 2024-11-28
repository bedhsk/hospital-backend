import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import Role from 'src/users/entities/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Allow access if there are no specific role requirements
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Allow access to SuperUser
    const superUser =
      user?.role?.name === 'SuperAdmin' || user?.role?.name === 'Dirección';
    if (superUser) {
      return true;
    }

    // Otherwise, check if the user's role matches one of the required roles
    const match = requiredRoles.includes(user?.role?.name);

    if (!match) {
      throw new UnauthorizedException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return match; // true if the user's role matches one of the required roles
  }
}
