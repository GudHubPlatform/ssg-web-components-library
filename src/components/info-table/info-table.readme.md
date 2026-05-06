# Component data-object:

("?": means "unnecessary")

```json
{
    "title?": "Lorem Ipsum Pricing",
    "subtitle?": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "items": [
        {
            "title": "Basic Plan",
            "price": "$19 / month"
        },
        {
            "title": "Standard Plan",
            "price": "$49 / month"
        },
        {
            "title": "Premium Plan",
            "price": "$99 / month"
        },
        {
            "title": "Enterprise Plan",
            "price": "Custom pricing"
        }
    ]
}
```

## Fields description

`title` - component title. If field does not exist, title will not be rendered.

`subtitle` - component subtitle. If field does not exist, subtitle will not be rendered.

`items` - array of table items.

`items.title` - item title.

`items.price` - item price/value.
