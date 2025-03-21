export const generateArticlesObject = (blog_chapter) => {
    const {
        app_id,
        type_field_id,
        status_field_id,
        article_post_date_field_id
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
                "property_name": "slug",
                "property_type": "field_value",
                "name_space": "slug",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 5,
                "property_name": "description",
                "property_type": "field_value",
                "name_space": "description",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 7,
                "property_name": "posted_at",
                "property_type": "field_value",
                "name_space": "posted_at",
                "interpretation": 0
            },
            {
                "type": "property",
                "id": 10,
                "property_name": "author",
                "property_type": "field_value",
                "name_space": "author",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 8,
                "property_name": "updated_at",
                "property_type": "field_value",
                "name_space": "updated_at"
            },
            {
                "type": "property",
                "id": 9,
                "property_name": "author_id",
                "property_type": "field_value",
                "name_space": "author"
            },
            {
                "type": "property",
                "id": 6,
                "property_name": "thumbnail_src",
                "property_type": "field_value",
                "name_space": "thumbnail_src",
                "interpretation": 1
            }
        ],
        "property_name": "articles",
        "app_id": app_id,
        "filter": [
            {
                "field_id": type_field_id,
                "data_type": "radio_button",
                "valuesArray": [
                    "0"
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
        ],
        "isSortable": 1,
        "field_id_to_sort": article_post_date_field_id,
        "sortType": "desc"
    }
};