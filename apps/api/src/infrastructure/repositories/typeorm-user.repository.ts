import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { UserRepository } from '../../domain/users/user-repository';
import { User } from '../../domain/users/user';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const entity = await this.repository.save({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      refreshTokenHash: user.refreshTokenHash,
      refreshTokenExpiresAt: user.refreshTokenExpiresAt ? new Date(user.refreshTokenExpiresAt) : undefined,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      documentId: user.documentId,
      addressLine: user.addressLine,
      city: user.city,
      country: user.country ?? 'CO',
      paymentMethods: user.paymentMethods ?? [],
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    });
    return this.mapToDomain(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? this.mapToDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? this.mapToDomain(user) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    await this.repository.update(id, {
      ...(user.email !== undefined && { email: user.email }),
      ...(user.passwordHash !== undefined && { passwordHash: user.passwordHash }),
      ...(user.refreshTokenHash !== undefined && { refreshTokenHash: user.refreshTokenHash }),
      ...(user.refreshTokenExpiresAt !== undefined && {
        refreshTokenExpiresAt: new Date(user.refreshTokenExpiresAt)
      }),
      ...(user.firstName !== undefined && { firstName: user.firstName }),
      ...(user.lastName !== undefined && { lastName: user.lastName }),
      ...(user.phone !== undefined && { phone: user.phone }),
      ...(user.documentId !== undefined && { documentId: user.documentId }),
      ...(user.addressLine !== undefined && { addressLine: user.addressLine }),
      ...(user.city !== undefined && { city: user.city }),
      ...(user.country !== undefined && { country: user.country }),
      ...(user.paymentMethods !== undefined && { paymentMethods: user.paymentMethods }),
      updatedAt: new Date(),
    });

    return this.findById(id);
  }

  private mapToDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      refreshTokenHash: entity.refreshTokenHash,
      refreshTokenExpiresAt: entity.refreshTokenExpiresAt?.toISOString(),
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      documentId: entity.documentId,
      addressLine: entity.addressLine,
      city: entity.city,
      country: entity.country,
      paymentMethods: entity.paymentMethods ?? [],
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }
}
