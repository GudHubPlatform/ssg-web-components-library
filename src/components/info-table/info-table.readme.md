Ось оновлений README під твій новий динамічний компонент з `headers` та `schema`.

````md
# Component data-object

`("?": means "unnecessary")`

```json
{
    "title?": "Lorem Ipsum Overview",
    "subtitle?": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "schema?": {
        "tableType": "https://schema.org/Table",
        "rowProp": "about",
        "rowType": "https://schema.org/Thing",
        "titleProp": "name",
        "valueProp": "description"
    },
    "headers?": [
        "Feature Name",
        "Description"
    ],
    "items": [
        {
            "title": "Lorem Ipsum Feature",
            "price": "Lorem ipsum dolor sit amet"
        },
        {
            "title": "Dolor Sit Amet",
            "price": "Consectetur adipiscing elit"
        },
        {
            "title": "Sed Do Eiusmod",
            "price": "Tempor incididunt ut labore"
        },
        {
            "title": "Ut Enim Ad Minim",
            "price": "Veniam quis nostrud exercitation"
        }
    ]
}
````

## Fields description

`title` - component title. If the field does not exist, the title will not be rendered.

`subtitle` - component subtitle. If the field does not exist, the subtitle will not be rendered.

`schema` - optional object for configuring microdata markup.

`schema.tableType` - Schema.org type for the table. Default value is `https://schema.org/Table`.

`schema.rowProp` - item property used for each table row. Default value is `about`.

`schema.rowType` - Schema.org type for each table row. Default value is `https://schema.org/Thing`.

`schema.titleProp` - item property for the first column value. Default value is `name`.

`schema.valueProp` - item property for the second column value. Default value is `description`.

`headers` - optional array of table header labels. If the field does not exist or is empty, the table header will not be rendered.

`items` - array of table rows.

`items.title` - item title. Usually rendered in the first table column.

`items.price` - item price/value/description. Usually rendered in the second table column.

---

# Pricing table example

Use this structure when the table contains services and prices.

```json
{
    "title": "3D Rendering Services Pricing",
    "subtitle": "Explore starting prices for different 3D rendering services.",
    "schema": {
        "tableType": "https://schema.org/Table",
        "rowProp": "about",
        "rowType": "https://schema.org/Service",
        "titleProp": "name",
        "valueType": "offer",
        "offerProp": "offers",
        "offerType": "https://schema.org/Offer",
        "priceProp": "price",
        "currencyProp": "priceCurrency"
    },
    "headers": [
        "Service Name",
        "Price Starts at"
    ],
    "items": [
        {
            "title": "Interior 3D Rendering",
            "price": "547",
            "currency": "CAD"
        },
        {
            "title": "Exterior 3D Rendering",
            "price": "683",
            "currency": "CAD"
        },
        {
            "title": "Commercial Interior 3D Rendering",
            "price": "820",
            "currency": "CAD"
        },
        {
            "title": "Commercial Exterior 3D Rendering",
            "price": "957",
            "currency": "CAD"
        }
    ]
}
```

## Additional fields for pricing table

`schema.valueType` - defines how the second column should be rendered. If the value is `offer`, the component renders the second column as a Schema.org `Offer`.

`schema.offerProp` - item property for the offer object. Default value is `offers`.

`schema.offerType` - Schema.org type for the offer. Default value is `https://schema.org/Offer`.

`schema.priceProp` - item property for the price value. Default value is `price`.

`schema.currencyProp` - item property for the currency value. Default value is `priceCurrency`.

`items.currency` - price currency. Required when `schema.valueType` is set to `offer`.

---

# Explanation

The component supports two table formats.

The first format is a regular informational table. In this case, each row is marked as a Schema.org `Thing`, the first column is marked as `name`, and the second column is marked as `description`.

Example output structure:

```text
Table
 └── about: Thing
      ├── name: Lorem Ipsum Feature
      └── description: Lorem ipsum dolor sit amet
```

The second format is a pricing table. In this case, each row is marked as a Schema.org `Service`, and the second column is rendered as an `Offer` with separate `price` and `priceCurrency` values.

Example output structure:

```text
Table
 └── about: Service
      ├── name: Interior 3D Rendering
      └── offers: Offer
           ├── price: 547
           └── priceCurrency: CAD
```

For regular text tables, use:

```json
"valueProp": "description"
```

For pricing tables, use:

```json
"valueType": "offer"
```

This allows the same component to be reused for simple informational tables and for service pricing tables with more correct microdata markup.
