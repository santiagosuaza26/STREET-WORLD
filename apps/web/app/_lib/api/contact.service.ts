import { apiClient } from "./client";

export type ContactMessageRequest = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactMessageResponse = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

class ContactService {
  async send(input: ContactMessageRequest): Promise<ContactMessageResponse> {
    const response = await apiClient.post<ContactMessageResponse>("/contact", input);
    return response.data;
  }
}

export const contactService = new ContactService();
