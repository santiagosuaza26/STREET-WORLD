import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("contact_messages")
export class ContactMessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 120 })
  fullName: string;

  @Column({ length: 160 })
  email: string;

  @Column({ length: 160 })
  subject: string;

  @Column({ type: "text" })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
