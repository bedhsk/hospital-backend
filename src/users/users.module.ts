import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import User from './entities/user.entity';
import Role from './entities/role.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [UsersController, RolesController],
    providers: [
        UsersService, 
        RolesService,
        {
            provide: APP_GUARD, 
            useClass: JwtGuard,
        },
        {
            provide: APP_GUARD, 
            useClass: RoleGuard,
        }
    ],
    exports: [UsersService],
})
export class UsersModule {}
