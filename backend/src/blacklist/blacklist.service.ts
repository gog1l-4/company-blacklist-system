import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Debt, DebtApprovalStatus, DebtStatus } from '../entities/debt.entity';

@Injectable()
export class BlacklistService {
    constructor(
        @InjectRepository(Debt)
        private debtRepository: Repository<Debt>,
    ) { }

    // ძებნა - მხოლოდ დამტკიცებული კომპანიები
    async search(query: string) {
        if (!query || query.trim() === '') {
            return [];
        }

        const debts = await this.debtRepository.find({
            where: [
                { targetCompanyName: Like(`%${query}%`), approvalStatus: DebtApprovalStatus.APPROVED },
                { targetTaxId: Like(`%${query}%`), approvalStatus: DebtApprovalStatus.APPROVED },
            ],
            order: { createdAt: 'DESC' },
        });

        // Add occurrence count for each result
        const debtsWithCount = await Promise.all(debts.map(async (debt) => {
            const count = await this.debtRepository.count({
                where: {
                    targetTaxId: debt.targetTaxId,
                    approvalStatus: DebtApprovalStatus.APPROVED
                },
            });

            return {
                ...debt,
                occurrenceCount: count,
            };
        }));

        return debtsWithCount;
    }

    // კომპანიის დამატება (PENDING სტატუსით)
    async addCompany(
        targetTaxId: string,
        targetCompanyName: string,
        debtAmount: number,
        reason: string,
        debtDate: Date,
        evidenceFile: string,
        reporter: any,
    ) {
        const debt = this.debtRepository.create({
            targetTaxId,
            targetCompanyName,
            debtAmount,
            reason,
            debtDate,
            evidenceFile,
            reporter,
            approvalStatus: DebtApprovalStatus.PENDING, // ავტომატურად pending
        });

        await this.debtRepository.save(debt);

        return {
            message: 'თქვენი მოთხოვნა გაიგზავნა ადმინისტრატორთან დასამტკიცებლად',
            debt: {
                id: debt.id,
                targetCompanyName: debt.targetCompanyName,
                status: debt.approvalStatus,
            },
        };
    }

    // ყველა დამტკიცებული კომპანია
    async getAll() {
        const debts = await this.debtRepository.find({
            where: { approvalStatus: DebtApprovalStatus.APPROVED },
            order: { createdAt: 'DESC' },
        });

        // Add occurrence count for each company (by tax ID)
        const debtsWithCount = await Promise.all(debts.map(async (debt) => {
            const count = await this.debtRepository.count({
                where: {
                    targetTaxId: debt.targetTaxId,
                    approvalStatus: DebtApprovalStatus.APPROVED
                },
            });

            return {
                ...debt,
                occurrenceCount: count,
            };
        }));

        return debtsWithCount;
    }

    // ადმინისთვის: pending debts
    async getPendingDebts() {
        return this.debtRepository.find({
            where: { approvalStatus: DebtApprovalStatus.PENDING },
            order: { createdAt: 'DESC' },
        });
    }

    // Debt-ის სტატუსის განახლება (approval status)
    async updateApprovalStatus(id: number, status: string) {
        await this.debtRepository.update(id, { approvalStatus: status as DebtApprovalStatus });
        return { message: 'სტატუსი განახლდა' };
    }

    // Admin: Update debt status (აქტიური/გადამოწმება/დახურული)
    async updateStatus(id: number, status: DebtStatus) {
        const debt = await this.debtRepository.findOne({ where: { id } });
        if (!debt) {
            throw new NotFoundException('ჩანაწერი ვერ მოიძებნა');
        }

        debt.debtStatus = status;
        await this.debtRepository.save(debt);

        return { message: 'სტატუსი განახლდა', debt };
    }

    // Admin: Delete entry
    async deleteEntry(id: number) {
        const debt = await this.debtRepository.findOne({ where: { id } });
        if (!debt) {
            throw new NotFoundException('ჩანაწერი ვერ მოიძებნა');
        }

        await this.debtRepository.remove(debt);

        return { message: 'ჩანაწერი წარმატებიტ წაიშალა' };
    }

    // Check for duplicate entries
    async checkDuplicate(targetTaxId: string, targetCompanyName: string) {
        // Find all approved entries with this tax ID
        const exactMatches = await this.debtRepository.find({
            where: {
                targetTaxId,
                approvalStatus: DebtApprovalStatus.APPROVED
            },
            relations: ['reporter'],
        });

        if (exactMatches.length > 0) {
            return {
                isDuplicate: true,
                type: 'exact',
                count: exactMatches.length,
                existing: exactMatches,
                message: `ამ საიდენტიფიკაციო ნომრით კომპანია უკვე ${exactMatches.length}-ჯერ არის დამატებული`,
            };
        }

        // Fuzzy company name matching
        const allApprovedDebts = await this.debtRepository.find({
            where: { approvalStatus: DebtApprovalStatus.APPROVED },
            relations: ['reporter'],
        });

        const similarCompanies = allApprovedDebts.filter(debt => {
            const similarity = this.calculateSimilarity(
                targetCompanyName.toLowerCase().trim(),
                debt.targetCompanyName.toLowerCase().trim()
            );
            return similarity > 0.8; // 80% similarity threshold
        });

        if (similarCompanies.length > 0) {
            return {
                isDuplicate: true,
                type: 'similar',
                count: similarCompanies.length,
                existing: similarCompanies,
                message: `${similarCompanies.length} მსგავსი კომპანია ნაპოვნია`,
            };
        }

        return {
            isDuplicate: false,
            message: 'დუბლიკატები არ ნაპოვნია',
        };
    }

    // Calculate string similarity using Levenshtein distance
    private calculateSimilarity(str1: string, str2: string): number {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    // Levenshtein distance algorithm
    private levenshteinDistance(str1: string, str2: string): number {
        const matrix = [];

        // Initialize first column
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        // Initialize first row
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        // Calculate distances
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }
}
