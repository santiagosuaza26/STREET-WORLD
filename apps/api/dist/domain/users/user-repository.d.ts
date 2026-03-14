import { User } from "./user";
export interface UserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, user: Partial<User>): Promise<User | null>;
}
export declare const USER_REPOSITORY: unique symbol;
