import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  isSupported: boolean;
}

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  private translations: Map<string, TranslationData> = new Map();
  private supportedLanguages: string[];
  private defaultLanguage: string;
  private fallbackLanguage: string;

  constructor(private configService: ConfigService) {
    this.supportedLanguages = this.configService.get('i18n.supportedLanguages');
    this.defaultLanguage = this.configService.get('i18n.defaultLanguage');
    this.fallbackLanguage = this.configService.get('i18n.fallbackLanguage');
    
    this.loadTranslations();
  }

  // Load all translation files
  private loadTranslations() {
    try {
      const i18nPath = this.configService.get('i18n.loaderOptions.path');
      const translationsPath = path.resolve(i18nPath);

      if (!fs.existsSync(translationsPath)) {
        this.logger.warn(`Translations directory not found: ${translationsPath}`);
        this.createDefaultTranslations();
        return;
      }

      for (const language of this.supportedLanguages) {
        const filePath = path.join(translationsPath, `${language}.json`);
        
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const translations = JSON.parse(content);
          this.translations.set(language, translations);
          this.logger.log(`Loaded translations for language: ${language}`);
        } else {
          this.logger.warn(`Translation file not found: ${filePath}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to load translations', error);
      this.createDefaultTranslations();
    }
  }

  // Create default translation files if they don't exist
  private createDefaultTranslations() {
    const i18nPath = this.configService.get('i18n.loaderOptions.path');
    const translationsPath = path.resolve(i18nPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(translationsPath)) {
      fs.mkdirSync(translationsPath, { recursive: true });
    }

    // Default English translations
    const enTranslations = {
      common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        forgotPassword: 'Forgot Password',
        resetPassword: 'Reset Password',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        loginSuccess: 'Login successful',
        loginFailed: 'Login failed',
        registerSuccess: 'Registration successful',
        invalidCredentials: 'Invalid credentials',
      },
      booking: {
        bookNow: 'Book Now',
        selectService: 'Select Service',
        selectDate: 'Select Date',
        selectTime: 'Select Time',
        bookingConfirmed: 'Booking Confirmed',
        bookingCancelled: 'Booking Cancelled',
        reschedule: 'Reschedule',
        cancel: 'Cancel Booking',
        upcoming: 'Upcoming Bookings',
        past: 'Past Bookings',
        noBookings: 'No bookings found',
      },
      services: {
        haircut: 'Haircut',
        massage: 'Massage',
        facial: 'Facial',
        nails: 'Nail Care',
        spa: 'Spa Treatment',
        beauty: 'Beauty Services',
        wellness: 'Wellness Services',
      },
      notifications: {
        bookingReminder: 'Booking Reminder',
        bookingConfirmation: 'Booking Confirmation',
        newMessage: 'New Message',
        paymentReceived: 'Payment Received',
      },
    };

    // Chinese translations
    const zhTranslations = {
      common: {
        welcome: '欢迎',
        loading: '加载中...',
        error: '发生错误',
        success: '成功',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        delete: '删除',
        edit: '编辑',
        search: '搜索',
        filter: '筛选',
        sort: '排序',
        next: '下一页',
        previous: '上一页',
        close: '关闭',
      },
      auth: {
        login: '登录',
        logout: '退出',
        register: '注册',
        forgotPassword: '忘记密码',
        resetPassword: '重置密码',
        email: '邮箱',
        password: '密码',
        confirmPassword: '确认密码',
        loginSuccess: '登录成功',
        loginFailed: '登录失败',
        registerSuccess: '注册成功',
        invalidCredentials: '凭据无效',
      },
      booking: {
        bookNow: '立即预约',
        selectService: '选择服务',
        selectDate: '选择日期',
        selectTime: '选择时间',
        bookingConfirmed: '预约已确认',
        bookingCancelled: '预约已取消',
        reschedule: '重新安排',
        cancel: '取消预约',
        upcoming: '即将到来的预约',
        past: '历史预约',
        noBookings: '未找到预约',
      },
      services: {
        haircut: '理发',
        massage: '按摩',
        facial: '美容护理',
        nails: '美甲',
        spa: '水疗',
        beauty: '美容服务',
        wellness: '健康服务',
      },
      notifications: {
        bookingReminder: '预约提醒',
        bookingConfirmation: '预约确认',
        newMessage: '新消息',
        paymentReceived: '收到付款',
      },
    };

    // Write translation files
    fs.writeFileSync(
      path.join(translationsPath, 'en.json'),
      JSON.stringify(enTranslations, null, 2)
    );

    fs.writeFileSync(
      path.join(translationsPath, 'zh.json'),
      JSON.stringify(zhTranslations, null, 2)
    );

    // Load the created translations
    this.translations.set('en', enTranslations);
    this.translations.set('zh', zhTranslations);

    this.logger.log('Created default translation files');
  }

  // Translate a key with optional parameters
  translate(key: string, language: string = this.defaultLanguage, params?: Record<string, any>): string {
    const lang = this.getSupportedLanguage(language);
    let translation = this.getTranslation(key, lang);

    // Fallback to default language if translation not found
    if (translation === key && lang !== this.fallbackLanguage) {
      translation = this.getTranslation(key, this.fallbackLanguage);
    }

    // Replace parameters in translation
    if (params && typeof translation === 'string') {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return translation as string;
  }

  // Get translation for a key
  private getTranslation(key: string, language: string): string | TranslationData {
    const translations = this.translations.get(language);
    if (!translations) {
      return key;
    }

    const keys = key.split('.');
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return key;
      }
    }

    return current;
  }

  // Get supported language or fallback
  private getSupportedLanguage(language: string): string {
    return this.supportedLanguages.includes(language) ? language : this.fallbackLanguage;
  }

  // Get all supported languages with metadata
  getSupportedLanguages(): LanguageInfo[] {
    const languageInfo: Record<string, Omit<LanguageInfo, 'code' | 'isDefault' | 'isSupported'>> = {
      en: { name: 'English', nativeName: 'English' },
      zh: { name: 'Chinese', nativeName: '中文' },
      es: { name: 'Spanish', nativeName: 'Español' },
      fr: { name: 'French', nativeName: 'Français' },
      de: { name: 'German', nativeName: 'Deutsch' },
      it: { name: 'Italian', nativeName: 'Italiano' },
      ja: { name: 'Japanese', nativeName: '日本語' },
      ko: { name: 'Korean', nativeName: '한국어' },
      ar: { name: 'Arabic', nativeName: 'العربية' },
      hi: { name: 'Hindi', nativeName: 'हिन्दी' },
    };

    return this.supportedLanguages.map(code => ({
      code,
      name: languageInfo[code]?.name || code.toUpperCase(),
      nativeName: languageInfo[code]?.nativeName || code.toUpperCase(),
      isDefault: code === this.defaultLanguage,
      isSupported: true,
    }));
  }

  // Get all translations for a language
  getTranslations(language: string): TranslationData | null {
    const lang = this.getSupportedLanguage(language);
    return this.translations.get(lang) || null;
  }

  // Add or update translation
  updateTranslation(key: string, value: string, language: string): boolean {
    try {
      const lang = this.getSupportedLanguage(language);
      const translations = this.translations.get(lang) || {};
      
      const keys = key.split('.');
      let current: any = translations;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in current) || typeof current[k] !== 'object') {
          current[k] = {};
        }
        current = current[k];
      }

      current[keys[keys.length - 1]] = value;
      this.translations.set(lang, translations);

      // Optionally save to file
      this.saveTranslationsToFile(lang, translations);
      
      return true;
    } catch (error) {
      this.logger.error('Failed to update translation', error);
      return false;
    }
  }

  // Save translations to file
  private saveTranslationsToFile(language: string, translations: TranslationData) {
    try {
      const i18nPath = this.configService.get('i18n.loaderOptions.path');
      const filePath = path.join(path.resolve(i18nPath), `${language}.json`);
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    } catch (error) {
      this.logger.error(`Failed to save translations for ${language}`, error);
    }
  }
}