# Attributes:

nothing

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title": "string",
    "subtitle": "string",
    "buttons?": {
      "primary": {
        "popupId": "string",
        "placement": "string",
        "text": "string"
      },
      "secondary": {
        "popupId": "string",
        "placement": "string",
        "text": "string"
      }
    },
    "rows": [
        {
            "row": [
                {
                    "image": {
                        "src": "string",
                        "title": "string",
                        "alt": "string"
                    },
                    "title": "string",
                    "subtitle": "string"
                }
            ]
        }
    ]
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id