import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(
        @Body('taxId') taxId: string,
        @Body('companyName') companyName: string,
        @Body('legalAddress') legalAddress: string,
        @Body('authorizedPersonName') authorizedPersonName: string,
        @Body('email') email: string,
        @Body('phoneNumber') phoneNumber: string,
        @Body('password') password: string,
    ) {
        return this.authService.register(
            taxId,
            companyName,
            legalAddress,
            authorizedPersonName,
            email,
            phoneNumber,
            password,
        );
    }

    @Post('login')
    async login(
        @Body('taxId') taxId: string,
        @Body('password') password: string,
    ) {
        return this.authService.login(taxId, password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return {
            user: {
                id: req.user.id,
                taxId: req.user.taxId,
                companyName: req.user.companyName,
                role: req.user.role,
                status: req.user.status,
            },
        };
    }
}
