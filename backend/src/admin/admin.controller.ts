import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // მხოლოდ ადმინები
export class AdminController {
    constructor(private adminService: AdminService) { }

    // User approval endpoints
    @Get('pending')
    async getPendingUsers() {
        return this.adminService.getPendingUsers();
    }

    @Post('approve/:id')
    async approveUser(@Param('id') id: string) {
        return this.adminService.approveUser(+id);
    }

    @Post('reject/:id')
    async rejectUser(@Param('id') id: string) {
        return this.adminService.rejectUser(+id);
    }

    // Debt approval endpoints
    @Get('pending-debts')
    async getPendingDebts() {
        return this.adminService.getPendingDebts();
    }

    @Post('approve-debt/:id')
    async approveDebt(@Param('id') id: string) {
        return this.adminService.approveDebt(+id);
    }

    @Post('reject-debt/:id')
    async rejectDebt(@Param('id') id: string, @Body('reason') reason: string) {
        return this.adminService.rejectDebt(+id, reason);
    }
}
