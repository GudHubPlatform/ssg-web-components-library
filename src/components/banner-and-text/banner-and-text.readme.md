# Data-attributes:
data-chapter

# Config object: 
("?" means "unnecessary")
```json
    {
        "title": "string",
        "subtitle?": "string",
        "offer": "string",
        "offer_subtitle": "string",
        "button?": {
            "class": "string",
            "text": "string"
        },
        "items": [
        {
            "title": "string",
            "text": "string"
        },
        {
            "title": "string",
            "text": "string"
        }
        ],
        "image": {
            "src": "string",
            "alt": "string",
            "title": "string"
        }
    },
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id