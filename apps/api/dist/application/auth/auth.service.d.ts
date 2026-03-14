import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "../../domain/users/user-repository";
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
export declare class AuthService {
    private readonly users;
    private readonly jwtService;
    constructor(users: UserRepository, jwtService: JwtService);
    register(input: RegisterInput): Promise<SessionResult>;
    login(input: LoginInput): Promise<SessionResult>;
    refresh(refreshToken: string): Promise<SessionResult>;
    logout(refreshToken?: string): Promise<void>;
    getAuthUser(userId: string): Promise<{
        id: string;
        email: string;
    }>;
    private createSession;
    private createTokens;
    private verifyRefreshToken;
    private getRefreshTokenLifetimeMs;
}
export {};
