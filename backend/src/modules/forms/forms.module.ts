import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { FormTemplate } from '../../entities/form-template.entity';
import { FormField } from '../../entities/form-field.entity';
import { FormSubmission } from '../../entities/form-submission.entity';
import { FormResponse } from '../../entities/form-response.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FormTemplate,
      FormField,
      FormSubmission,
      FormResponse,
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}