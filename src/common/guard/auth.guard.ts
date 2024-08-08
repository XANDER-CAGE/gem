import { IS_PUBLIC_KEY } from './../decorator/public.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject() private readonly userService: UsersService;

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) throw new UnauthorizedException();
    const user = await this.userService.getUser(token);
    if (!user) throw new UnauthorizedException();
    if (user?.is_blocked) {
      throw new ForbiddenException(
        'Access denied. Please pay tuition in full.',
      );
    }
    request.user = user;
    request.profile = user.profile;
    return true;
  }
}
