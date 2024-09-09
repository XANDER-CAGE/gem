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
import { StudentProfilesService } from 'src/modules/student-profiles/student-profiles.service';
import { UsersService } from 'src/modules/users/users.service';
import { Role } from '../enum/role.enum';
import { LevelService } from 'src/modules/level/level.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject() private readonly userService: UsersService;
  @Inject() private readonly profileService: StudentProfilesService;
  @Inject() private readonly levelService: LevelService;

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
    if (user.role == Role.student && !user.profile) {
      user.profile = await this.profileService.create({
        student_id: user.id,
      });
      await this.levelService.connectReachedLevels(user.profile.id, 0);
    }
    request.user = user;
    request.profile = user.profile;
    return true;
  }
}
