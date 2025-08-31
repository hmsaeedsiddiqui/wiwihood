import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsPage } from '../../entities/cms-page.entity';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(CmsPage)
    private readonly cmsRepository: Repository<CmsPage>,
  ) {}

  findAll() {
    return this.cmsRepository.find();
  }

  findOne(id: string) {
    return this.cmsRepository.findOneBy({ id });
  }

  findBySlug(slug: string) {
    return this.cmsRepository.findOneBy({ slug });
  }

  create(data: Partial<CmsPage>) {
    const page = this.cmsRepository.create(data);
    return this.cmsRepository.save(page);
  }

  update(id: string, data: Partial<CmsPage>) {
    return this.cmsRepository.update(id, data);
  }

  remove(id: string) {
    return this.cmsRepository.delete(id);
  }
}
