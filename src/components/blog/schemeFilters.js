const clientConfig = window.getConfig();

export const generateSlugFilterByLanguage = (slug_field_id) => {
    const lang = clientConfig?.currentLanguage;

    if (slug_field_id && lang) {
        return {
            field_id: slug_field_id,
            data_type: "text",
            boolean_strategy: "and",
            valuesArray: [
                `/${lang}/`
            ],
            search_type: "contain_or",
            selected_search_option_variable: "Value"
        }
    }

    return {};
};