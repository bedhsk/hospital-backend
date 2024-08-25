import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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
    console.log("Usuario: " , user)

    // Allow access to users with 'Admin' or 'Gerente' roles
    const hasAdminOrManagerRole = user?.role?.name === 'Admin' || user?.role?.name === 'Gerente';
    if (hasAdminOrManagerRole) {
      return true;
    }

    // Otherwise, check if the user's role matches one of the required roles
    return requiredRoles.includes(user?.role?.name);
  }
}