import { AuthService } from "../../application/auth/auth.service";
import { RegisterDto, LoginDto, AuthResponseDto } from "./dtos";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<AuthResponseDto>;
    login(body: LoginDto): Promise<AuthResponseDto>;
}
