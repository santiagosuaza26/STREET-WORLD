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
export declare class AuthService {
    private readonly users;
    private readonly jwtService;
    constructor(users: UserRepository, jwtService: JwtService);
    register(input: RegisterInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    login(input: LoginInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    private createToken;
}
export {};
