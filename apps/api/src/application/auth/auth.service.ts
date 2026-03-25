import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { User } from "../../domain/users/user";
import { USER_REPOSITORY, UserRepository } from "../../domain/users/user-repository";

type RegisterInput = {
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthResponse = {
  id: string;
  email: string;
  expiresIn: string;
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

type SessionResult = {
  user: AuthResponse;
  tokens: TokenPair;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(input: RegisterInput): Promise<SessionResult> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new BadRequestException("El correo ya esta registrado");
    }

    const passwordHash = await hash(input.password, 10);
    const user: User = {
      id: randomUUID(),
      email: input.email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    await this.users.create(user);

    return this.createSession(user);
  }

  async login(input: LoginInput): Promise<SessionResult> {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException("Credenciales invalidas");
    }

    const isValid = await compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Credenciales invalidas");
    }

    return this.createSession(user);
  }

  async refresh(refreshToken: string): Promise<SessionResult> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.users.findById(String(payload.sub));
    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new UnauthorizedException("Sesion invalida");
    }

    const isValid = await compare(refreshToken, user.refreshTokenHash);
    const isExpired = new Date(user.refreshTokenExpiresAt).getTime() <= Date.now();

    if (!isValid || isExpired) {
      throw new UnauthorizedException("Sesion expirada");
    }

    return this.createSession(user);
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      const userId = String(payload.sub);
      await this.users.update(userId, {
        refreshTokenHash: "",
        refreshTokenExpiresAt: new Date(0).toISOString(),
      });
    } catch {
      // Keep logout idempotent even for invalid/expired tokens.
    }
  }

  async getAuthUser(userId: string): Promise<{ id: string; email: string }> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Sesion invalida");
    }

    return { id: user.id, email: user.email };
  }

  private async createSession(user: User): Promise<SessionResult> {
    const tokens = await this.createTokens(user);
    const refreshTokenHash = await hash(tokens.refreshToken, 10);
    const refreshExpiresAt = new Date(Date.now() + this.getRefreshTokenLifetimeMs()).toISOString();

    await this.users.update(user.id, {
      refreshTokenHash,
      refreshTokenExpiresAt: refreshExpiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        expiresIn: tokens.expiresIn,
      },
      tokens,
    };
  }

  private async createTokens(user: User): Promise<TokenPair> {
    const expiresIn = process.env.JWT_EXPIRES_IN ?? "15m";
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "30d";
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
    if (!refreshSecret) {
      throw new BadRequestException("Configuracion de autenticacion incompleta");
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });
    
    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private async verifyRefreshToken(token: string): Promise<{ sub: string; email: string }> {
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
    if (!refreshSecret) {
      throw new UnauthorizedException("Configuracion de autenticacion incompleta");
    }
    try {
      return await this.jwtService.verifyAsync(token, { secret: refreshSecret });
    } catch {
      throw new UnauthorizedException("Sesion invalida");
    }
  }

  private getRefreshTokenLifetimeMs(): number {
    const raw = (process.env.JWT_REFRESH_EXPIRES_IN ?? "30d").trim().toLowerCase();
    const match = raw.match(/^(\d+)([smhd])$/);

    if (!match) {
      return 30 * 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] ?? 24 * 60 * 60 * 1000);
  }
}
