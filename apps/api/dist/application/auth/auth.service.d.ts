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
    token: string;
    expiresIn: string;
};
export declare class AuthService {
    private readonly users;
    private readonly jwtService;
    constructor(users: UserRepository, jwtService: JwtService);
    register(input: RegisterInput): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
    private createToken;
}
export {};
