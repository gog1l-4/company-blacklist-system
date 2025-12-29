import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserStatus } from '../entities/user.entity';

@Injectable()
export class StatusGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // მხოლოდ APPROVED მომხმარებლებს შეუძლიათ გაგრძელება
        if (!user || user.status !== UserStatus.APPROVED) {
            throw new ForbiddenException('თქვენი ანგარიში ჯერ არ არის დამტკიცებული');
        }

        return true;
    }
}
