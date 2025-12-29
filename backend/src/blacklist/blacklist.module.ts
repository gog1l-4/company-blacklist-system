import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { Debt } from '../entities/debt.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Debt])],
    providers: [BlacklistService],
    controllers: [BlacklistController],
})
export class BlacklistModule { }
