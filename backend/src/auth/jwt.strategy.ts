import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'your-secret-key-change-in-production', // TODO: Move to env
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload.sub);
        return {
            id: user.id,
            taxId: user.taxId,
            companyName: user.companyName,
            role: user.role,
            status: user.status,
        };
    }
}
