import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { ContactService } from "../../application/contact/contact.service";
import { CreateContactMessageDto } from "./dtos";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body(ValidationPipe) body: CreateContactMessageDto) {
    const created = await this.contactService.create(body);
    return {
      id: created.id,
      fullName: created.fullName,
      email: created.email,
      subject: created.subject,
      message: created.message,
      createdAt: created.createdAt,
    };
  }
}
