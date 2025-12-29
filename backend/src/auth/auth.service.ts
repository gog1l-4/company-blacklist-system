import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(
        taxId: string,
        companyName: string,
        legalAddress: string,
        authorizedPersonName: string,
        email: string,
        phoneNumber: string,
        password: string,
    ) {
        // Validate Tax ID format (9 digits)
        if (!/^\d{9}$/.test(taxId)) {
            throw new ConflictException('საიდენტიფიკაციო კოდი უნდა იყოს 9 ციფრი');
        }

        // Validate password length
        if (password.length < 8) {
            throw new ConflictException('პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან');
        }

        // Check if Tax ID already exists
        const existingUser = await this.userRepository.findOne({ where: { taxId } });

        if (existingUser) {
            // If user was rejected, prevent re-registration
            if (existingUser.status === UserStatus.REJECTED) {
                throw new ConflictException('ეს საიდენტიფიკაციო კოდი უარყოფილია და ვერ დარეგისტრირდება');
            }
            throw new ConflictException('ეს საიდენტიფიკაციო კოდი უკვე რეგისტრირებულია');
        }

        // Check if email already exists
        const existingEmail = await this.userRepository.findOne({ where: { email } });
        if (existingEmail) {
            throw new ConflictException('ეს ელ-ფოსტა უკვე რეგისტრირებულია');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with PENDING status
        const user = this.userRepository.create({
            taxId,
            companyName,
            legalAddress,
            authorizedPersonName,
            email,
            phoneNumber,
            password: hashedPassword,
            status: UserStatus.PENDING,
            role: 'user',
        });

        await this.userRepository.save(user);

        return {
            message: 'რეგისტრაცია წარმატებულია. თქვენი მოთხოვნა გაიგზავნა ადმინისტრატორთან.',
            user: {
                id: user.id,
                taxId: user.taxId,
                companyName: user.companyName,
                email: user.email,
                status: user.status,
            },
        };
    }

    async login(taxId: string, password: string) {
        const user = await this.userRepository.findOne({ where: { taxId } });

        if (!user) {
            throw new UnauthorizedException('არასწორი საიდენტიფიკაციო კოდი ან პაროლი');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('არასწორი საიდენტიფიკაციო კოდი ან პაროლი');
        }

        // Generate JWT
        const payload = {
            sub: user.id,
            taxId: user.taxId,
            role: user.role,
            status: user.status,
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user.id,
                taxId: user.taxId,
                companyName: user.companyName,
                role: user.role,
                status: user.status,
            },
        };
    }

    async validateUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
