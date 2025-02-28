const generateAuthorPageScheme = ({
  categories_list_field_id,
}) => [
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
      "id": 11,
      "property_name": "categories",
      "property_type": "function",
      "function": `function(item, appId) {\n  const app = await gudhub.getApp(appId);\n  const categoryField = item.fields.find(field => field.field_id == ${categories_list_field_id});\n  if(categoryField) {\n    const categoryItems = categoryField.field_value.split(',');\n    const categoryItemsIds = categoryItems.map(item => Number(item.split('.')[1]));\n    return app.items_list.filter(item => categoryItemsIds.includes(Number(item.item_id)));\n  }\n  return null;\n}`
    },
    {
      "type": "property",
      "id": 15,
      "property_name": "thumbnail_alt",
      "property_type": "field_value",
      "name_space": "thumbnail_alt",
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
      "id": 14,
      "property_name": "thumbnail_title",
      "property_type": "field_value",
      "name_space": "thumbnail_title",
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
      "id": 8,
      "property_name": "thumbnail",
      "property_type": "field_value",
      "name_space": "thumbnail",
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
];

export default generateAuthorPageScheme;