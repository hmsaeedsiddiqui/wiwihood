import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../../entities/contact-message.entity';

export interface CreateContactMessageDto {
  name: string;
  email: string;
  message: string;
}

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactMessageRepository: Repository<ContactMessage>,
  ) {}

  async findAll() {
    return this.contactMessageRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    return this.contactMessageRepository.findOne({ where: { id } });
  }

  async create(createContactMessageDto: CreateContactMessageDto) {
    const contactMessage = this.contactMessageRepository.create(createContactMessageDto);
    return this.contactMessageRepository.save(contactMessage);
  }

  async markAsRead(id: string) {
    return this.contactMessageRepository.update(id, { status: 'read' });
  }

  async reply(id: string, adminResponse: string) {
    return this.contactMessageRepository.update(id, { 
      status: 'replied',
      adminResponse,
      respondedAt: new Date()
    });
  }

  async remove(id: string) {
    return this.contactMessageRepository.delete(id);
  }
}