import { Controller, Get, Post, Patch, Delete, Body, Query, Param, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlacklistService } from './blacklist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatusGuard } from '../auth/status.guard';
import { RoleGuard } from '../auth/role.guard';
import { DebtStatus } from '../entities/debt.entity';

// Multer configuration for file upload
const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `evidence-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, callback) => {
    // დაშვებული ფაილის ტიპები
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        callback(null, true);
    } else {
        callback(new Error('მხოლოდ PDF, JPG და PNG ფაილები დაშვებულია'), false);
    }
};

@Controller('blacklist')
@UseGuards(JwtAuthGuard, StatusGuard) // მხოლოდ დამტკიცებული მომხმარებლები
export class BlacklistController {
    constructor(private blacklistService: BlacklistService) { }

    @Get('search')
    async search(@Query('q') query: string) {
        return this.blacklistService.search(query);
    }

    @Post('add')
    @UseInterceptors(
        FileInterceptor('evidenceFile', {
            storage,
            fileFilter,
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
        }),
    )
    async addCompany(
        @Body('targetTaxId') targetTaxId: string,
        @Body('targetCompanyName') targetCompanyName: string,
        @Body('debtAmount') debtAmount: number,
        @Body('reason') reason: string,
        @Body('debtDate') debtDate: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
    ) {
        // ფაილი სავალდებულოა
        if (!file) {
            throw new BadRequestException('დამადასტურებელი საბუთი (ფაილი) აუცილებელია');
        }

        return this.blacklistService.addCompany(
            targetTaxId,
            targetCompanyName,
            debtAmount,
            reason,
            new Date(debtDate),
            file.filename, // save only filename
            req.user,
        );
    }

    @Get()
    async getAll() {
        return this.blacklistService.getAll();
    }

    // Admin only: Update debt status
    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RoleGuard) // Admin only
    async updateStatus(
        @Param('id') id: number,
        @Body('status') status: DebtStatus,
    ) {
        return this.blacklistService.updateStatus(id, status);
    }

    // Admin only: Delete debt entry
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard) // Admin only
    async deleteEntry(@Param('id') id: number) {
        return this.blacklistService.deleteEntry(id);
    }

    // Check for duplicate entries
    @Post('check-duplicate')
    async checkDuplicate(
        @Body('targetTaxId') targetTaxId: string,
        @Body('targetCompanyName') targetCompanyName: string,
    ) {
        return this.blacklistService.checkDuplicate(targetTaxId, targetCompanyName);
    }
}
