"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../../application/auth/auth.service");
const user_repository_1 = require("../../domain/users/user-repository");
const in_memory_user_repository_1 = require("../../infrastructure/users/in-memory-user.repository");
const auth_controller_1 = require("./auth.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ?? "dev-secret",
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
            })
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            {
                provide: user_repository_1.USER_REPOSITORY,
                useClass: in_memory_user_repository_1.InMemoryUserRepository
            }
        ]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map