import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    async signIn(username: string, password: string): Promise<User> {
        const user = await this.usersService.findOneByUsername(username);
        if (user === undefined) {
            throw new UnauthorizedException();
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
