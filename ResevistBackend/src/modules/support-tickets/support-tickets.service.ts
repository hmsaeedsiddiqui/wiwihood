import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from '../../entities/support-ticket.entity';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,
  ) {}

  findAll() {
    return this.supportTicketRepository.find({ relations: ['user'] });
  }

  findOne(id: string) {
    return this.supportTicketRepository.findOne({ where: { id }, relations: ['user'] });
  }

  create(data: Partial<SupportTicket>) {
    const ticket = this.supportTicketRepository.create(data);
    return this.supportTicketRepository.save(ticket);
  }

  update(id: string, data: Partial<SupportTicket>) {
    return this.supportTicketRepository.update(id, data);
  }

  remove(id: string) {
    return this.supportTicketRepository.delete(id);
  }
}
