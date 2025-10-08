import { registerAs } from '@nestjs/config';

export default registerAs('i18n', () => ({
  fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'en,zh,ur,ar,es,fr').split(','),
  loaderOptions: {
    path: process.env.I18N_PATH || 'src/i18n/',
    watch: process.env.I18N_WATCH_FILES === 'true' || process.env.NODE_ENV === 'development',
  },
  debug: process.env.I18N_DEBUG === 'true' || process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  viewEngine: 'hbs', // For handlebars templates
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
  },
}));