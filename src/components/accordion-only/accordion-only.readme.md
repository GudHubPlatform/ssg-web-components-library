# Attributes:

None

# Component data-object:

("?" means "unnecessary")

```json
{
  "title?": "string",
  "subtitle?": "string",
  "items": [
    [
      {
        "title": "string",
        "text": "string",
        "button?": {
          "link": "/link/",
          "popupId": "form",
          "placement": "accordion-only",
          "text": "Button Text"
        },
        "list?": {
          "tag?": "string", // "ol" or "ul"
          "items": ["string", "string", "string"]
        }
      }
    ],
    [
      {
        "title": "string",
        "text": "string",
        "button?": {
          "link": "/link/",
          "popupId": "form",
          "placement": "accordion-only",
          "text": "Button Text"
        },
        "list?": {
          "tag?": "string", // "ol" or "ul"
          "items": ["string", "string", "string"]
        }
      }
    ]
  ]
}
```