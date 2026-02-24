import { AuthService } from "../../application/auth/auth.service";
type RegisterRequest = {
    email: string;
    password: string;
};
type LoginRequest = {
    email: string;
    password: string;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterRequest): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    login(body: LoginRequest): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
}
export {};
