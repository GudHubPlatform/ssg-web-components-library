# Attributes:

data-heading-outer: it's can choose position of title (2 variants: in title under the content, if false title be flex-wrapper.left)

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title": "string",
    "subtitle": "string",
    "heading_level": "string",
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
    "list": [
      "string"
    ],
    "texts?": [
      "string"
    ],
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