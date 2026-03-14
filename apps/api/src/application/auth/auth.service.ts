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
  token: string;
  expiresIn: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
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

    return this.createToken(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException("Credenciales invalidas");
    }

    const isValid = await compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Credenciales invalidas");
    }

    return this.createToken(user);
  }

  private async createToken(user: User): Promise<AuthResponse> {
    const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    
    return {
      id: user.id,
      email: user.email,
      token,
      expiresIn
    };
  }
}
