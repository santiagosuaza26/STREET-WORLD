import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContactMessageEntity } from "../../infrastructure/database/entities";

type CreateContactInput = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly messages: Repository<ContactMessageEntity>
  ) {}

  async create(input: CreateContactInput) {
    const entity = this.messages.create({
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      subject: input.subject.trim(),
      message: input.message.trim(),
    });

    return this.messages.save(entity);
  }
}
