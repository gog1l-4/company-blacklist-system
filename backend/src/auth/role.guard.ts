import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Check if user is admin
        if (!user || user.role !== 'admin') {
            throw new ForbiddenException('მხოლოდ ადმინისტრატორს აქვს წვდომა');
        }

        return true;
    }
}
