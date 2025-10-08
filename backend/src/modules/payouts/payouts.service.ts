import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payout } from '../../entities/payout.entity';

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
  ) {}

  findAll() {
    return this.payoutRepository.find({ relations: ['provider'] });
  }

  findOne(id: string) {
    return this.payoutRepository.findOne({ where: { id }, relations: ['provider'] });
  }

  create(data: Partial<Payout>) {
    const payout = this.payoutRepository.create(data);
    return this.payoutRepository.save(payout);
  }

  update(id: string, data: Partial<Payout>) {
    return this.payoutRepository.update(id, data);
  }

  remove(id: string) {
    return this.payoutRepository.delete(id);
  }
}
