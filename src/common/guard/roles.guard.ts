import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enum/role.enum';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const req = context.switchToHttp().getRequest();

    function hasRole(userRole: Role, allowedRoles: Role[]) {
      return allowedRoles.includes(userRole);
    }

    if (
      (!req?.user ||
        !hasRole(req.user.role, [
          Role.app_admin,
          Role.merge_admin,
          Role.sport_center_admin,
          Role.career_center_admin,
          Role.bloomberg_admin,
          Role.media_studio_admin,
        ])) &&
      !req.profile
    ) {
      throw new NotFoundException('Role is forbidden');
    }
    return requiredRoles.includes(req?.user?.role);
  }
}
