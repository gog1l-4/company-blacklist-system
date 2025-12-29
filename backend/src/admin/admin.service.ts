import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../entities/user.entity';
import { Debt, DebtApprovalStatus } from '../entities/debt.entity';

@Injectable()
export class AdminService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Debt)
        private debtRepository: Repository<Debt>,
    ) { }

    // User approval methods
    async getPendingUsers() {
        const users = await this.usersService.getAllPending();
        return users.map((user) => ({
            id: user.id,
            taxId: user.taxId,
            companyName: user.companyName,
            authorizedPersonName: user.authorizedPersonName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            legalAddress: user.legalAddress,
            status: user.status,
        }));
    }

    async approveUser(id: number) {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
        }

        await this.usersService.updateStatus(id, UserStatus.APPROVED);
        return { message: 'მომხმარებელი დამტკიცებულია', userId: id };
    }

    async rejectUser(id: number) {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
        }

        await this.usersService.updateStatus(id, UserStatus.REJECTED);
        return { message: 'მომხმარებელი უარყოფილია', userId: id };
    }

    // Debt approval methods
    async getPendingDebts() {
        const debts = await this.debtRepository.find({
            where: { approvalStatus: DebtApprovalStatus.PENDING },
            order: { createdAt: 'DESC' },
        });

        return debts;
    }

    async approveDebt(id: number) {
        const debt = await this.debtRepository.findOne({ where: { id } });
        if (!debt) {
            throw new NotFoundException('ჩანაწერი ვერ მოიძებნა');
        }

        await this.debtRepository.update(id, { approvalStatus: DebtApprovalStatus.APPROVED });
        return { message: 'ჩანაწერი დამტკიცებულია', debtId: id };
    }

    async rejectDebt(id: number, reason: string) {
        const debt = await this.debtRepository.findOne({ where: { id } });
        if (!debt) {
            throw new NotFoundException('ჩანაწერი ვერ მოიძებნა');
        }

        await this.debtRepository.update(id, {
            approvalStatus: DebtApprovalStatus.REJECTED,
            rejectionReason: reason,
        });
        return { message: 'ჩანაწერი უარყოფილია', debtId: id };
    }
}
