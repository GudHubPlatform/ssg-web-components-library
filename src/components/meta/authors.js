export const generateAuthorsObject = (blog_chapter) => {
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
                "property_name": "title",
                "property_type": "field_value",
                "name_space": "title",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 4,
                "property_name": "name",
                "property_type": "field_value",
                "name_space": "h1",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 12,
                "property_name": "id",
                "property_type": "variable",
                "variable_type": "current_item"
            },
            {
                "type": "property",
                "id": 16,
                "property_name": "intro",
                "property_type": "field_value",
                "name_space": "intro",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 13,
                "property_name": "intro_id",
                "property_type": "field_value",
                "name_space": "intro"
            },
            {
                "type": "property",
                "id": 10,
                "property_name": "description",
                "property_type": "field_value",
                "name_space": "description",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 6,
                "property_name": "facebook",
                "property_type": "field_value",
                "name_space": "facebook",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 9,
                "property_name": "thumbnail_src",
                "property_type": "field_value",
                "name_space": "thumbnail_src",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 7,
                "property_name": "slug",
                "property_type": "field_value",
                "name_space": "slug",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 5,
                "property_name": "linkedin",
                "property_type": "field_value",
                "name_space": "linkedin",
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