import { User } from "../../domain/users/user";
import { UserRepository } from "../../domain/users/user-repository";
export declare class InMemoryUserRepository implements UserRepository {
    private readonly usersByEmail;
    private readonly usersById;
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
