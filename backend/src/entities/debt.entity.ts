import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum DebtApprovalStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum DebtStatus {
    ACTIVE = 'active',           // 🔴 აქტიური
    UNDER_REVIEW = 'under_review', // 🟠 გადამოწმების პროცესში
    CLOSED = 'closed',           // 🟢 დახურული
}

@Entity()
export class Debt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 15, scale: 2 })
    debtAmount: number;

    @Column('text')
    reason: string;

    @Column()
    debtDate: Date; // როდის წარმოიქმნა დავალიანება

    @Column()
    targetTaxId: string; // ვისზეა დავალიანება (კომპანიის ს/კ)

    @Column()
    targetCompanyName: string; // კომპანიის სახელი

    // ფაილის ატვირთვა (სავალდებულო!)
    @Column()
    evidenceFile: string; // ფაილის path

    // Approval workflow
    @Column({
        type: 'text',
        default: DebtApprovalStatus.PENDING,
    })
    approvalStatus: DebtApprovalStatus; // pending/approved/rejected

    @Column({ nullable: true })
    rejectionReason: string; // თუ უარყოფილია, რატომ

    @ManyToOne(() => User, (user) => user.reportedDebts, { eager: true })
    reporter: User; // ვინ დაამატა

    // Debt lifecycle status (different from approval status)
    @Column({
        type: 'text',
        default: DebtStatus.UNDER_REVIEW,
    })
    debtStatus: DebtStatus; // active/under_review/closed

    @CreateDateColumn()
    createdAt: Date; // როდის დაემატა სისტემაში
}
