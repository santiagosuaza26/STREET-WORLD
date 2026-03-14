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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
const user_repository_1 = require("../../domain/users/user-repository");
let AuthService = class AuthService {
    constructor(users, jwtService) {
        this.users = users;
        this.jwtService = jwtService;
    }
    async register(input) {
        const existing = await this.users.findByEmail(input.email);
        if (existing) {
            throw new common_1.BadRequestException("El correo ya esta registrado");
        }
        const passwordHash = await (0, bcryptjs_1.hash)(input.password, 10);
        const user = {
            id: (0, crypto_1.randomUUID)(),
            email: input.email,
            passwordHash,
            createdAt: new Date().toISOString()
        };
        await this.users.create(user);
        return this.createSession(user);
    }
    async login(input) {
        const user = await this.users.findByEmail(input.email);
        if (!user) {
            throw new common_1.UnauthorizedException("Credenciales invalidas");
        }
        const isValid = await (0, bcryptjs_1.compare)(input.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException("Credenciales invalidas");
        }
        return this.createSession(user);
    }
    async refresh(refreshToken) {
        const payload = await this.verifyRefreshToken(refreshToken);
        const user = await this.users.findById(String(payload.sub));
        if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
            throw new common_1.UnauthorizedException("Sesion invalida");
        }
        const isValid = await (0, bcryptjs_1.compare)(refreshToken, user.refreshTokenHash);
        const isExpired = new Date(user.refreshTokenExpiresAt).getTime() <= Date.now();
        if (!isValid || isExpired) {
            throw new common_1.UnauthorizedException("Sesion expirada");
        }
        return this.createSession(user);
    }
    async logout(refreshToken) {
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
        }
        catch {
        }
    }
    async getAuthUser(userId) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException("Sesion invalida");
        }
        return { id: user.id, email: user.email };
    }
    async createSession(user) {
        const tokens = await this.createTokens(user);
        const refreshTokenHash = await (0, bcryptjs_1.hash)(tokens.refreshToken, 10);
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
    async createTokens(user) {
        const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
        const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "30d";
        const refreshSecret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "dev-secret";
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
    async verifyRefreshToken(token) {
        const refreshSecret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "dev-secret";
        try {
            return await this.jwtService.verifyAsync(token, { secret: refreshSecret });
        }
        catch {
            throw new common_1.UnauthorizedException("Sesion invalida");
        }
    }
    getRefreshTokenLifetimeMs() {
        const raw = (process.env.JWT_REFRESH_EXPIRES_IN ?? "30d").trim().toLowerCase();
        const match = raw.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 30 * 24 * 60 * 60 * 1000;
        }
        const value = Number(match[1]);
        const unit = match[2];
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return value * (multipliers[unit] ?? 24 * 60 * 60 * 1000);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map