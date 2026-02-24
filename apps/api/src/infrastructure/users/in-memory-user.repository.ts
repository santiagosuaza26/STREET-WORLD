import { Injectable } from "@nestjs/common";
import { User } from "../../domain/users/user";
import { UserRepository } from "../../domain/users/user-repository";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly usersByEmail = new Map<string, User>();
  private readonly usersById = new Map<string, User>();

  async create(user: User): Promise<User> {
    this.usersByEmail.set(user.email, user);
    this.usersById.set(user.id, user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersByEmail.get(email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.usersById.get(id) ?? null;
  }
}
