const clientConfig = window.getConfig();

export const generateSlugFilterByLanguage = (slug_field_id) => {
    const { currentLanguage, defaultLanguage, languageList } = clientConfig;

    if (!currentLanguage || !defaultLanguage) return {};

    if (currentLanguage === defaultLanguage && languageList) {
        return {
            field_id: slug_field_id,
            data_type: "text",
            valuesArray: [
                ...languageList
            ],
            search_type: "not_contain_and",
            selected_search_option_variable: "Value"
        }
    }

    if (currentLanguage !== defaultLanguage) {
        return {
            field_id: slug_field_id,
            data_type: "text",
            boolean_strategy: "and",
            valuesArray: [
                `/${currentLanguage}/`
            ],
            search_type: "contain_or",
            selected_search_option_variable: "Value"
        }
    }
};