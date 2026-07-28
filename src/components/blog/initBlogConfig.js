import defaultConfigs from '../default-blog-config.json';
import { getLanguageSettings } from './language.js';

export function initBlogConfig(blogConfig) {
    try {
        if (!blogConfig) {
            throw new Error('blogConfig is empty');
        }

        if (!Array.isArray(blogConfig)) {
            return blogConfig;
        }

        const { currentLanguage, defaultLanguage } = getLanguageSettings();

        const config = blogConfig.find(({ langCode }) => langCode === currentLanguage)
            || blogConfig.find(({ langCode }) => langCode === defaultLanguage)
            || blogConfig.find(({ defaultLang }) => defaultLang)
            || blogConfig[0];

        if (!config) {
            throw new Error('blogConfig for current language not found');
        }

        return config;
    } catch (error) {
        return defaultConfigs;
    }
}
