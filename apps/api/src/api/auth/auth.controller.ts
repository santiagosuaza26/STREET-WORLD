import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "../../application/auth/auth.service";
import { JwtAuthGuard } from "../guards";
import { AuthMeResponseDto, AuthResponseDto, LoginDto, RegisterDto } from "./dtos";

type RequestWithUser = Request & { user?: { sub: string; email: string } };

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body(ValidationPipe) body: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(body);
    this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    return result.user;
  }

  @Post("login")
  async login(
    @Body(ValidationPipe) body: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(body);
    this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    return result.user;
  }

  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const refreshToken = this.extractCookie(req, this.getRefreshCookieName());
    const result = await this.authService.refresh(refreshToken);
    this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    return result.user;
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.extractCookie(req, this.getRefreshCookieName());
    await this.authService.logout(refreshToken);
    this.clearAuthCookies(res);
    return { ok: true };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: RequestWithUser): Promise<AuthMeResponseDto> {
    return this.authService.getAuthUser(String(req.user?.sub));
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const secure = process.env.COOKIE_SECURE === "true";
    const domain = process.env.COOKIE_DOMAIN || undefined;

    res.cookie(this.getAccessCookieName(), accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      domain,
      maxAge: this.getCookieMaxAge(process.env.JWT_EXPIRES_IN ?? "7d"),
    });

    res.cookie(this.getRefreshCookieName(), refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      domain,
      maxAge: this.getCookieMaxAge(process.env.JWT_REFRESH_EXPIRES_IN ?? "30d"),
    });
  }

  private clearAuthCookies(res: Response) {
    const secure = process.env.COOKIE_SECURE === "true";
    const domain = process.env.COOKIE_DOMAIN || undefined;

    res.clearCookie(this.getAccessCookieName(), { path: "/", sameSite: "lax", secure, domain });
    res.clearCookie(this.getRefreshCookieName(), { path: "/", sameSite: "lax", secure, domain });
  }

  private extractCookie(req: Request, cookieName: string): string {
    const raw = req.headers.cookie ?? "";
    const entries = raw.split(";").map((value) => value.trim());
    for (const entry of entries) {
      if (!entry) {
        continue;
      }

      const [name, ...rest] = entry.split("=");
      if (name === cookieName) {
        return decodeURIComponent(rest.join("="));
      }
    }
    return "";
  }

  private getAccessCookieName() {
    return process.env.ACCESS_TOKEN_COOKIE_NAME ?? "access_token";
  }

  private getRefreshCookieName() {
    return process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refresh_token";
  }

  private getCookieMaxAge(expiresIn: string): number {
    const raw = expiresIn.trim().toLowerCase();
    const match = raw.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return amount * (multipliers[unit] ?? 24 * 60 * 60 * 1000);
  }
}
