import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { I18nService } from './i18n.service';

@ApiTags('Internationalization')
@ApiBearerAuth()
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @ApiOperation({ summary: 'Get supported languages' })
  @ApiResponse({ status: 200, description: 'Supported languages retrieved successfully' })
  @Get('languages')
  getSupportedLanguages() {
    return this.i18nService.getSupportedLanguages();
  }

  @ApiOperation({ summary: 'Get all translations for a language' })
  @ApiResponse({ status: 200, description: 'Translations retrieved successfully' })
  @ApiQuery({ name: 'lang', description: 'Language code', example: 'en' })
  @Get('translations')
  getTranslations(@Query('lang') language: string = 'en') {
    return this.i18nService.getTranslations(language);
  }

  @ApiOperation({ summary: 'Translate a specific key' })
  @ApiResponse({ status: 200, description: 'Translation retrieved successfully' })
  @ApiQuery({ name: 'key', description: 'Translation key', example: 'common.welcome' })
  @ApiQuery({ name: 'lang', description: 'Language code', example: 'en', required: false })
  @Get('translate')
  translate(
    @Query('key') key: string,
    @Query('lang') language?: string,
    @Query() params?: Record<string, any>
  ) {
    const translation = this.i18nService.translate(key, language, params);
    return { key, translation, language: language || 'en' };
  }

  @ApiOperation({ summary: 'Update translation for a key' })
  @ApiResponse({ status: 200, description: 'Translation updated successfully' })
  @Post('translate')
  updateTranslation(
    @Body() body: { key: string; value: string; language: string }
  ) {
    const success = this.i18nService.updateTranslation(body.key, body.value, body.language);
    return { success, message: success ? 'Translation updated' : 'Failed to update translation' };
  }
}