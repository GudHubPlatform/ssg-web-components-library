const generateAllArticlesScheme = ({
    app_id,
    type_field_id,
    status_field_id,
    article_post_date_field_id
}) => ({
    "type": "array",
    "id": 1,
    "childs": [
        {
            "type": "property",
            "id": 3,
            "property_name": "slug",
            "property_type": "field_value",
            "name_space": "slug",
            "interpretation": 1
        },
        {
            "type": "property",
            "id": 4,
            "property_name": "title",
            "property_type": "field_value",
            "name_space": "title",
            "interpretation": 1
        },
        {
            "type": "property",
            "id": 9,
            "property_name": "thumbnail_alt",
            "property_type": "field_value",
            "name_space": "thumbnail_alt",
            "interpretation": 1
        },
        {
            "type": "property",
            "id": 11,
            "property_name": "categories",
            "property_type": "function",
            "function": "function(item, appId) {\n  const app = await gudhub.getApp(appId);\n  const categoryField = item.fields.find(field => field.field_id == 807622);\n  if(categoryField) {\n    const categoryItems = categoryField.field_value.split(',');\n    const categoryItemsIds = categoryItems.map(item => Number(item.split('.')[1]));\n    return app.items_list.filter(item => categoryItemsIds.includes(Number(item.item_id)));\n  }\n  return null;\n}"
        },
        {
            "type": "property",
            "id": 8,
            "property_name": "thumbnail_title",
            "property_type": "field_value",
            "name_space": "thumbnail_title",
            "interpretation": 1
        },
        {
            "type": "property",
            "id": 6,
            "property_name": "thumbnail",
            "name_space": "thumbnail",
            "property_type": "field_value",
            "interpretation": 1
        },
        {
            "type": "property",
            "id": 7,
            "property_name": "thumbnail_src",
            "property_type": "field_value",
            "name_space": "thumbnail_src",
            "interpretation": 1
        },
        {
            "type": "property",
            "id": 5,
            "property_name": "h1",
            "name_space": "h1",
            "property_type": "field_value",
            "interpretation": 1
        }
    ],
    "property_name": "all_articles",
    "app_id": `${app_id}`,
    "filter": [
        {
            "field_id": `${type_field_id}`,
            "data_type": "radio_button",
            "valuesArray": [
                "0"
            ],
            "search_type": "equal_or",
            "selected_search_option_variable": "Value"
        },
        {
            "field_id": `${status_field_id}`,
            "data_type": "radio_button",
            "valuesArray": [
                "1"
            ],
            "search_type": "equal_or",
            "selected_search_option_variable": "Value"
        }
    ],
    "isSortable": 1,
    "field_id_to_sort": `${article_post_date_field_id}`,
    "sortType": "desc"
});

export default generateAllArticlesScheme;