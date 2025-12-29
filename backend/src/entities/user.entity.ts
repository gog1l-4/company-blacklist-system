import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Debt } from './debt.entity';

export enum UserStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    // კომპანიის იურიდიული მონაცემები
    @Column({ unique: true, length: 9 })
    taxId: string; // მხოლოდ 9 ციფრი

    @Column()
    companyName: string; // კომპანიის იურიდიული დასახელება

    @Column({ nullable: true })
    legalAddress: string; // იურიდიული მისამართი

    // ავტორიზებული პირის მონაცემები
    @Column()
    authorizedPersonName: string; // სახელი და გვარი

    @Column({ unique: true })
    email: string; // სამუშაო ელ-ფოსტა

    @Column()
    phoneNumber: string; // მობილურის ნომერი

    // უსაფრთხოება
    @Column()
    password: string; // ჰეშირებული პაროლი (მინ. 8 სიმბოლო)

    @Column({ default: 'user' }) // 'user' ან 'admin'
    role: string;

    @Column({
        type: 'text',
        default: UserStatus.PENDING,
    })
    status: UserStatus;

    @OneToMany(() => Debt, (debt) => debt.reporter)
    reportedDebts: Debt[];
}
