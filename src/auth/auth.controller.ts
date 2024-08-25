import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local.guard';
import { Request } from 'express';
import User from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IsPublic } from 'src/common/is-public.decorator';


@Controller('auth')
export class AuthController {
    constructor(private readonly jwtService: JwtService) { }

    @Post('login')
    @IsPublic()
    @UseGuards(LocalGuard)
    async login(@Req() request: Request) {
        const user = request.user as User;
        const payload = {
            sub: user.id,
            name: `${user.name} ${user.lastname}`,
            iat: new Date().getTime(),
            role: user.role,
        }

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            access_token: accessToken,
        };
    }
}
