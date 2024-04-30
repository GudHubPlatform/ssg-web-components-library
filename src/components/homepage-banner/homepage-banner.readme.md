# Attributes:

nothing

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title": "string",
    "subtitle": "string",
    "list": [
      "string"
    ],
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
    "image": {
      "src": "string",
      "alt": "string",
      "title": "string"
    }
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id