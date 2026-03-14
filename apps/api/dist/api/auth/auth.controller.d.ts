import type { Request, Response } from "express";
import { AuthService } from "../../application/auth/auth.service";
import { AuthMeResponseDto, AuthResponseDto, LoginDto, RegisterDto } from "./dtos";
type RequestWithUser = Request & {
    user?: {
        sub: string;
        email: string;
    };
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto, res: Response): Promise<AuthResponseDto>;
    login(body: LoginDto, res: Response): Promise<AuthResponseDto>;
    refresh(req: Request, res: Response): Promise<AuthResponseDto>;
    logout(req: Request, res: Response): Promise<{
        ok: boolean;
    }>;
    me(req: RequestWithUser): Promise<AuthMeResponseDto>;
    private setAuthCookies;
    private clearAuthCookies;
    private extractCookie;
    private getAccessCookieName;
    private getRefreshCookieName;
    private getCookieMaxAge;
}
export {};
