import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { User } from './entities/user.entity';
import { Debt } from './entities/debt.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [User, Debt],
            synchronize: true, // ავტომატურად ქმნის ცხრილებს და ამატებს ახალ column-ებს
            dropSchema: false, // FALSE = მონაცემები არ იშლება!
        }),
        AuthModule,
        UsersModule,
        AdminModule,
        BlacklistModule,
    ],
})
export class AppModule { }
