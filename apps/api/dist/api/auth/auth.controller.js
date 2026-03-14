"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../application/auth/auth.service");
const guards_1 = require("../guards");
const dtos_1 = require("./dtos");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(body, res) {
        const result = await this.authService.register(body);
        this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
        return result.user;
    }
    async login(body, res) {
        const result = await this.authService.login(body);
        this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
        return result.user;
    }
    async refresh(req, res) {
        const refreshToken = this.extractCookie(req, this.getRefreshCookieName());
        const result = await this.authService.refresh(refreshToken);
        this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
        return result.user;
    }
    async logout(req, res) {
        const refreshToken = this.extractCookie(req, this.getRefreshCookieName());
        await this.authService.logout(refreshToken);
        this.clearAuthCookies(res);
        return { ok: true };
    }
    async me(req) {
        return this.authService.getAuthUser(String(req.user?.sub));
    }
    setAuthCookies(res, accessToken, refreshToken) {
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
    clearAuthCookies(res) {
        const secure = process.env.COOKIE_SECURE === "true";
        const domain = process.env.COOKIE_DOMAIN || undefined;
        res.clearCookie(this.getAccessCookieName(), { path: "/", sameSite: "lax", secure, domain });
        res.clearCookie(this.getRefreshCookieName(), { path: "/", sameSite: "lax", secure, domain });
    }
    extractCookie(req, cookieName) {
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
    getAccessCookieName() {
        return process.env.ACCESS_TOKEN_COOKIE_NAME ?? "access_token";
    }
    getRefreshCookieName() {
        return process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refresh_token";
    }
    getCookieMaxAge(expiresIn) {
        const raw = expiresIn.trim().toLowerCase();
        const match = raw.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 7 * 24 * 60 * 60 * 1000;
        }
        const amount = Number(match[1]);
        const unit = match[2];
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return amount * (multipliers[unit] ?? 24 * 60 * 60 * 1000);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("refresh"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map