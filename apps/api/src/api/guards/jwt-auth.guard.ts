import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    const cookieName = process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'access_token';
    const entries = cookieHeader.split(';').map((value) => value.trim());
    for (const entry of entries) {
      const [name, ...rest] = entry.split('=');
      if (name === cookieName) {
        return decodeURIComponent(rest.join('='));
      }
    }

    return undefined;
  }
}
