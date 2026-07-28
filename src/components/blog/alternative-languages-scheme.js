const generateAlternativeLanguagesScheme = ({
    app_id,
    status_field_id,
    slug_field_id
}, slug) => ({
    "type": "array",
    "id": 1,
    "childs": [
        {
            "type": "property",
            "id": 3,
            "property_name": "alternative_languages",
            "property_type": "field_value",
            "name_space": "alternative_languages",
            "interpretation": 0
        },
        {
            "type": "property",
            "id": 4,
            "property_name": "slug",
            "property_type": "field_value",
            "name_space": "slug",
            "interpretation": 1
        }
    ],
    "property_name": "alt_pages",
    "app_id": app_id,
    "filter": [
        {
            "field_id": status_field_id,
            "data_type": "radio_button",
            "boolean_strategy": "and",
            "valuesArray": [
                "1"
            ],
            "search_type": "equal_or",
            "selected_search_option_variable": "Value"
        },
        {
            "field_id": slug_field_id,
            "data_type": "text",
            "boolean_strategy": "and",
            "valuesArray": [
                slug
            ],
            "search_type": "equal_or",
            "selected_search_option_variable": "Value"
        }
    ]
});

export default generateAlternativeLanguagesScheme;
