import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import Role from "src/users/entities/role.entity";
import { UsersService } from "src/users/users.service";

type Payload = {
    sub: number;
    name: string;
    role: Role;
    iat: number;
}

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: Payload){
        const user = await this.userService.findOne(payload.sub);
        return user;
    }
}