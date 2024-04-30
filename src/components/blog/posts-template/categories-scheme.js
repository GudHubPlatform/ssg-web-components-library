const generateCategoriesScheme = ({
    app_id,
    type_field_id,
    status_field_id
}) => {
    const scheme = {
        type: "array",
        id: 1,
        childs: [
            {
                type: "property",
                id: 6,
                property_name: "slug",
                property_type: "field_value",
                name_space: "slug",
                interpretation: 1
            },
            {
                type: "property",
                id: 3,
                property_name: "title",
                property_type: "field_value",
                name_space: "title",
                interpretation: 1
            },
            {
                type: "property",
                id: 4,
                property_name: "h1",
                property_type: "field_value",
                name_space: "h1",
                interpretation: 1
            },
            {
                type: "property",
                id: 5,
                property_name: "category_id",
                property_type: "variable",
                variable_type: "current_item"
            }
        ],
        property_name: "categories",
        app_id: app_id,
        filter: [
            {
                field_id: type_field_id,
                data_type: "radio_button",
                valuesArray: [
                    "2"
                ],
                search_type: "equal_or",
                selected_search_option_variable: "Value"
            },
            {
                field_id: status_field_id,
                data_type: "radio_button",
                valuesArray: [
                    "1"
                ],
                search_type: "equal_or",
                selected_search_option_variable: "Value"
            },

        ]
    }

    return scheme;
};

export default generateCategoriesScheme;