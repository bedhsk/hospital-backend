import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import Role from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, RolesService],
  controllers: [UsersController, RolesController]
})
export class UsersModule {}
