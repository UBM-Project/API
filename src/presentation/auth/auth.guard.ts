import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jose from 'jose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token ausente');
        }

        const token = authHeader.split(' ')[1];
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
            const payload = await jose.jwtVerify(token, secret);
            request.user = payload.payload;
            const now = Math.floor(Date.now() / 1000);
            if (request.user.exp && request.user.exp <= now) {
                throw new UnauthorizedException('Token expirado');
            }
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token inválido');
        }
    }
}
