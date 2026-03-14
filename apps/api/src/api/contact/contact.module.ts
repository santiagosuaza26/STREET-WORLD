import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactService } from "../../application/contact/contact.service";
import { ContactMessageEntity } from "../../infrastructure/database/entities";
import { ContactController } from "./contact.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessageEntity])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
