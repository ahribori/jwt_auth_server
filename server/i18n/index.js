import i18n from 'i18n';
import path from 'path';

// i18n
i18n.configure({
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    cookie: 'locale',
    objectNotation: true,
    directory: path.resolve(__dirname, './locales')

});

export default i18n;