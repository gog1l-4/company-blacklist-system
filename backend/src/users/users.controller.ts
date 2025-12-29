import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatusGuard } from '../auth/status.guard';

@Controller('users')
export class UsersController {
    @UseGuards(JwtAuthGuard, StatusGuard)
    @Get('profile')
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
