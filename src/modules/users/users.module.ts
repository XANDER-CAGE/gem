import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepo } from './user.repo';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepo],
})
export class UsersModule {}
