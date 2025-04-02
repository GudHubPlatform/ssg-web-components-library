# Attributes:

data-items-in-row=[number]: to calculate item width in flex container;

data-items-shadow: to turn on grid_item shadows;

data-border-top-on-hover: to add grid_item border top on hover

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title": "Title",
    "subtitle": "Subtitle",
    "cards": [
      {
        "title": "Card title",
        "price": "300 грн",
        "subtitle": "item subtitle",
        "list": [
          {
            "boolean": "true",
            "text": "Lorem ipsum dolor sit amet"
          },
          {
            "boolean": "true",
            "text": "Morbi euismod elementum nibh"
          },
          {
            "boolean": "false",
            "text": "Aliquam aliquam consequat molestie"
          },
          {
            "boolean": "false",
            "text": "Morbi vel lacinia lorem"
          }
        ],
        "button?": {
          "popupId?": "form",
          "placement?": "prices_cards",
          "text": "Спробувати Безкоштовно",
          "class?": "empty"
        }
      }
    ]
}
```

## Button property

class: this class name will be applyed to button (example: define styles of secondary button by using "empty" class)