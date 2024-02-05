export async function generateArticlesAndCommentsObject(filter, value) {
    let comments = {
        "type": "array",
        "id": 1,
        "childs": [
            {
                "type": "property",
                "id": 3,
                "property_name": "article_id",
                "property_type": "field_value",
                "name_space": "article",
                "interpretation": 0
            }
        ],
        "property_name": "comments",
        "app_id": "33454",
        "filter": [
            {
                "field_id": 796249,
                "data_type": "radio_button",
                "valuesArray": [
                    "1"
                ],
                "search_type": "equal_or",
                "$$hashKey": "object:3549",
                "selected_search_option_variable": "Value"
            }
        ]
    };
    let articles = {
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
                "property_name": "h1",
                "property_type": "field_value",
                "name_space": "h1",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 3,
                "property_name": "intro",
                "property_type": "field_value",
                "name_space": "intro"
            },
            { 
                "type": "property", 
                "id": 3, 
                "property_name": "intro_id", 
                "property_type": "field_id", 
                "name_space": "intro" 
            },
            {
                "type": "property",
                "id": 5,
                "property_name": "slug",
                "property_type": "field_value",
                "name_space": "slug",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 21,
                "property_name": "content",
                "property_type": "field_value",
                "name_space": "article_content",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 20,
                "property_name": "views",
                "property_type": "field_value",
                "name_space": "views",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 19,
                "property_name": "description",
                "property_type": "field_value",
                "name_space": "description",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 18,
                "property_name": "posted_at",
                "property_type": "field_value",
                "name_space": "posted_at",
                "interpretation": 0
            },
            {
                "type": "property",
                "id": 17,
                "property_name": "updated_at",
                "property_type": "field_value",
                "name_space": "updated_at"
            },
            {
                "type": "property",
                "id": 14,
                "property_name": "author",
                "property_type": "field_value",
                "name_space": "author",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 15,
                "property_name": "author_id",
                "property_type": "field_value",
                "name_space": "author"
            },
            {
                "type": "property",
                "id": 16,
                "property_name": "categories",
                "property_type": "function",
                "function": "function(item, appId) {\n  const app = await gudhub.getApp(appId);\n  const categoryField = item.fields.find(field => field.field_id == 796231);\n  if(categoryField) {\n    const categoryItems = categoryField.field_value.split(',');\n    const categoryItemsIds = categoryItems.map(item => Number(item.split('.')[1]));\n    return app.items_list.filter(item => categoryItemsIds.includes(Number(item.item_id)));\n  }\n  return null;\n}"
            },
            {
                "type": "property",
                "id": 11,
                "property_name": "thumbnail_src",
                "property_type": "field_value",
                "name_space": "thumbnail_src",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 13,
                "property_name": "thumbnail_alt",
                "property_type": "field_value",
                "name_space": "thumbnail_alt",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 10,
                "property_name": "id",
                "property_type": "variable",
                "variable_type": "current_item"
            },
            {
                "type": "property",
                "id": 12,
                "property_name": "thumbnail_title",
                "property_type": "field_value",
                "name_space": "thumbnail_title",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 9,
                "property_name": "thumbnail",
                "property_type": "field_value",
                "name_space": "thumbnail",
                "interpretation": 1
            },
            {
                "type": "property",
                "id": 6,
                "property_name": "category",
                "property_type": "field_value",
                "name_space": "category"
            },
            {
                "type": "property",
                "id": 7,
                "property_name": "rating",
                "property_type": "function",
                "function": "function(item, appId) {\n  const app = await gudhub.getApp(appId)\n  let ratings = item.fields.find(field => field.field_id == 796224);\n  let summ = 0;\n  if(ratings) {\n    ratings = ratings.field_value.split(',');\n    ratings.forEach(item => summ += Number(item));\n  }\n  return {\n    count: ratings.length || 0,\n    avg: summ / ratings.length\n  };\n}"
            },
            {
                "type": "property",
                "id": 8,
                "property_name": "time_to_read",
                "property_type": "field_value",
                "name_space": "time_to_read",
                "interpretation": 1
            }
        ],
        "property_name": "articles",
        "app_id": "33453",
        "filter": [
            //type
            {
                "field_id": 796213,
                "data_type": "radio_button",
                "valuesArray": [
                    "0"
                ],
                "search_type": "equal_or",
                "$$hashKey": "object:17515",
                "selected_search_option_variable": "Value"
            },
            //status
            {
                "field_id": 796222,
                "data_type": "radio_button",
                "valuesArray": filter == "slug" ? ["1", "0"] : ["1"],
                "search_type": "equal_or",
                "$$hashKey": "object:17557",
                "selected_search_option_variable": "Value"
            }
        ]
    };


    switch (filter) {
        case "slug":
            articles.filter.push({
                "field_id": 796214,
                "data_type": "text",
                "valuesArray": [
                    value
                ],
                "search_type": "contain_or",
                "$$hashKey": "object:5841",
                "selected_search_option_variable": "Value"
            });
            break;
        case "category":
            articles.filter.push({
                "field_id": 796231,
                "data_type": "item_ref",
                "valuesArray": [
                    value
                ],
                "search_type": "equal_or",
                "$$hashKey": "object:1225",
                "selected_search_option_variable": "Value"
            });
            break;
        case "author":
            articles.filter.push({
                "field_id": 796221,
                "data_type": "item_ref",
                "valuesArray": [
                    value
                ],
                "search_type": "equal_or",
                "$$hashKey": "object:1025",
                "selected_search_option_variable": "Value"
            });
            break;
    }

    let object = {
        "type": "object",
        "id": 3,
        "childs": [
            comments,
            articles
        ],
        "property_name": "articlesAndComments"
    };

    return object;
}
