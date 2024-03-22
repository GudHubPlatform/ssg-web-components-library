export const generateAuthorObject = (blog_chapter) => {
    const {
        app_id,
        type_field_id,
        status_field_id
    } = blog_chapter;
    return {
        "type": "array",
        "id": 1,
        "childs": [
            {
                "type": "property",
                "id": 3,
                "property_name": "name",
                "property_type": "field_value",
                "name_space": "h1",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 4,
                "property_name": "author_id",
                "property_type": "variable",
                "variable_type": "current_item"
            },
            {
                "type": "property",
                "id": 5,
                "property_name": "slug",
                "property_type": "field_value",
                "name_space": "slug",
                "interpretation": 1
            }
        ],
        "property_name": "authors",
        "app_id": app_id,
        "filter": [
            {
                "field_id": type_field_id,
                "data_type": "radio_button",
                "valuesArray": [
                    "1"
                ],
                "search_type": "equal_or",
                "selected_search_option_variable": "Value"
            },
            {
                "field_id": status_field_id,
                "data_type": "radio_button",
                "valuesArray": [
                    "1"
                ],
                "search_type": "equal_or",
                "selected_search_option_variable": "Value"
            }
        ]
    }
};