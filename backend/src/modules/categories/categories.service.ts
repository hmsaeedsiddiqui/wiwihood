import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, slug, ...categoryData } = createCategoryDto;

    // Check if category name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name }
    });
    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    // Generate slug if not provided
    const finalSlug = slug || this.generateSlug(name);

    // Check if slug already exists
    const existingSlug = await this.categoryRepository.findOne({
      where: { slug: finalSlug }
    });
    if (existingSlug) {
      throw new BadRequestException('Category with this slug already exists');
    }

    const category = this.categoryRepository.create({
      name,
      slug: finalSlug,
      ...categoryData,
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      isFeatured: categoryData.isFeatured !== undefined ? categoryData.isFeatured : false,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(isActive?: boolean): Promise<Category[]> {
    const where = isActive !== undefined ? { isActive } : {};
    
    return await this.categoryRepository.find({
      where,
      relations: ['services'],
      order: {
        sortOrder: 'ASC',
        name: 'ASC'
      }
    });
  }

  async findFeatured(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['services'],
      order: {
        sortOrder: 'ASC',
        name: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['services', 'services.provider']
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['services', 'services.provider']
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    const { name, slug, ...updateData } = updateCategoryDto;

    // Check for duplicate name if name is being updated
    if (name && name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name }
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException('Category with this name already exists');
      }
    }

    // Check for duplicate slug if slug is being updated
    if (slug && slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findOne({
        where: { slug }
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new BadRequestException('Category with this slug already exists');
      }
    }

    // Update slug if name changed but slug wasn't provided
    let finalSlug = slug;
    if (name && !slug && name !== category.name) {
      const newSlug = this.generateSlug(name);
      const existingNewSlug = await this.categoryRepository.findOne({
        where: { slug: newSlug }
      });
      if (!existingNewSlug || existingNewSlug.id === id) {
        finalSlug = newSlug;
      }
    }

    Object.assign(category, { name, slug: finalSlug, ...updateData });
    category.updatedAt = new Date();

    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has services
    if (category.services && category.services.length > 0) {
      throw new BadRequestException('Cannot delete category with existing services');
    }

    await this.categoryRepository.remove(category);
  }

  async toggleActiveStatus(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    category.updatedAt = new Date();

    return await this.categoryRepository.save(category);
  }

  async toggleFeaturedStatus(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isFeatured = !category.isFeatured;
    category.updatedAt = new Date();

    return await this.categoryRepository.save(category);
  }

  async search(query: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) }
      ],
      relations: ['services'],
      order: {
        name: 'ASC'
      }
    });
  }

  async updateSortOrder(categoryOrders: { id: string; sortOrder: number }[]): Promise<void> {
    for (const item of categoryOrders) {
      await this.categoryRepository.update(item.id, { sortOrder: item.sortOrder });
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}
