# Attributes:

reverse: image and accordion places will be reversed

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title?": "Title",
    "subtitle?": "Subtitle",
    "items": [
        {
            "title": "Item Title",
            "text": "Item text",
            "button": {
                "link?": "#",
                "popupId?": "popupId",
                "placement": "media-and-accordion",
                "text": "button text"
            },
            "image": {
                "src": "",
                "alt": "Item Alt",
                "title": "Item Title"
            }
        }
    ]
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id