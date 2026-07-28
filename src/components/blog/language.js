import generateAlternativeLanguagesScheme from './alternative-languages-scheme.js';

const getClientConfig = () => (
    typeof window !== 'undefined' && typeof window.getConfig === 'function'
        ? window.getConfig() || {}
        : {}
);

export const getBlogChapter = () => getClientConfig()?.chapters?.blog || null;

/**
 * @returns {{ multiLanguage: boolean, currentLanguage: string|null, defaultLanguage: string|null, languageList: string[], isDefaultLanguage: boolean }}
 */
export const getLanguageSettings = () => {
    const { multiLanguage, currentLanguage, defaultLanguage, languageList } = getClientConfig();

    if (!multiLanguage || !currentLanguage || !defaultLanguage) {
        return {
            multiLanguage: false,
            currentLanguage: currentLanguage || defaultLanguage || null,
            defaultLanguage: defaultLanguage || null,
            languageList: [],
            isDefaultLanguage: true
        };
    }

    return {
        multiLanguage: true,
        currentLanguage,
        defaultLanguage,
        languageList: Array.isArray(languageList) ? languageList : [],
        isDefaultLanguage: currentLanguage === defaultLanguage
    };
};

export const getCurrentLanguage = () => getLanguageSettings().currentLanguage;

export const getLangPrefix = () => {
    const { multiLanguage, currentLanguage, isDefaultLanguage } = getLanguageSettings();

    return !multiLanguage || isDefaultLanguage ? '' : `/${currentLanguage}`;
};

export const getBlogRootLink = () => `${getLangPrefix()}/blog/`;

export const getLanguageBySlug = (slug = '') => {
    const { defaultLanguage, languageList } = getLanguageSettings();
    const [firstSegment] = String(slug).split('/').filter(Boolean);

    return languageList.includes(firstSegment) ? firstSegment : defaultLanguage;
};

export const generateSlugFilterByLanguage = (slug_field_id) => {
    const { multiLanguage, currentLanguage, languageList, isDefaultLanguage } = getLanguageSettings();

    if (!multiLanguage || !slug_field_id) return null;

    if (isDefaultLanguage) {
        const languagePrefixes = languageList.map((lang) => `/${lang}/`);

        if (!languagePrefixes.length) return null;

        return {
            field_id: slug_field_id,
            data_type: 'text',
            boolean_strategy: 'and',
            valuesArray: languagePrefixes,
            search_type: 'not_contain_and',
            selected_search_option_variable: 'Value'
        };
    }

    return {
        field_id: slug_field_id,
        data_type: 'text',
        boolean_strategy: 'and',
        valuesArray: [`/${currentLanguage}/`],
        search_type: 'contain_or',
        selected_search_option_variable: 'Value'
    };
};

export const generateLanguageFilters = (slug_field_id) => (
    [generateSlugFilterByLanguage(slug_field_id)].filter(Boolean)
);

export const getAlternativeLanguages = async (slug) => {
    const { multiLanguage } = getLanguageSettings();
    const blogChapter = getBlogChapter();

    if (!multiLanguage || !blogChapter || !slug) return [];

    try {
        const currentItem = (await gudhub.jsonConstructor(
            generateAlternativeLanguagesScheme(blogChapter, slug)
        ))?.alt_pages?.[0];

        const itemIds = String(currentItem?.alternative_languages || '')
            .split(',')
            .map((reference) => reference.split('.')[1])
            .filter(Boolean);

        if (!itemIds.length) return [];

        const app = await gudhub.getApp(blogChapter.app_id);

        return itemIds.reduce((alternatives, itemId) => {
            const item = app.items_list.find(({ item_id }) => String(item_id) === String(itemId));

            const alternativeSlug = item?.fields.find(
                ({ field_id }) => String(field_id) === String(blogChapter.slug_field_id)
            )?.field_value;

            if (alternativeSlug) {
                alternatives.push({
                    langCode: getLanguageBySlug(alternativeSlug),
                    slug: alternativeSlug
                });
            }

            return alternatives;
        }, []);
    } catch (error) {
        console.warn('[blog] alternative_languages are unavailable for', slug, error);
        return [];
    }
};

export const renderAlternateLinks = async (slug) => {
    const alternatives = await getAlternativeLanguages(slug);

    if (!alternatives.length) return alternatives;

    const { defaultLanguage } = getLanguageSettings();
    const website = getClientConfig().website;
    const protocol = window.MODE === 'production' ? 'https' : 'http';

    [{ langCode: getLanguageBySlug(slug), slug }, ...alternatives].forEach(({ langCode, slug: alternativeSlug }) => {
        if (document.head.querySelector(`link[rel="alternate"][hreflang="${langCode}"]`)) return;

        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', langCode);
        link.setAttribute('href', `${protocol}://${website}${alternativeSlug}`);
        document.head.appendChild(link);

        if (langCode === defaultLanguage) {
            const defaultLink = link.cloneNode();
            defaultLink.setAttribute('hreflang', 'x-default');
            document.head.appendChild(defaultLink);
        }
    });

    return alternatives;
};
