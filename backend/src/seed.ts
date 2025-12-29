import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from './entities/user.entity';

export async function seedDatabase(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
        where: { role: 'admin' },
    });

    if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = userRepository.create({
        taxId: '000000000',
        companyName: 'System Administrator',
        legalAddress: 'Tbilisi, Georgia',
        authorizedPersonName: 'System Admin',
        email: 'admin@system.local',
        phoneNumber: '500000000',
        password: hashedPassword,
        role: 'admin',
        status: UserStatus.APPROVED,
    });

    await userRepository.save(admin);

    console.log('✅ Default admin user created');
    console.log('   Tax ID: 000000000');
    console.log('   Password: admin123');
    console.log('   ⚠️  Please change the password in production!');
}
