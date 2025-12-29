import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // მხოლოდ ადმინებს შეუძლიათ წვდომა
        if (!user || user.role !== 'admin') {
            throw new ForbiddenException('მხოლოდ ადმინისტრატორებს აქვთ წვდომა');
        }

        return true;
    }
}
