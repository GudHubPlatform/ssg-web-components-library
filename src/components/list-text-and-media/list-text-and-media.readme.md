# Attributes:

    data-image-shadow: adds box-shadow to image
    data-image-radius: adds border-radius to image
    data-image-border: adds border to image


# Component data-object: 
("?" means "unnecessary")
```json
{
    "title?": "Title",
    "subtitle?": "Subtitle",
    "items": [
        {
            "title": "Item Title",
            "subtitle": "Item Subtitle",
            "button": {
                "link?": "#",
                "popupId?": "popupId",
                "text": "link text"
            },
            "image": {
                "src": "",
                "alt": "Item Title",
                "title": "Item Title"
            },
            "text_list": [
                "Vestibulum eget pretium mi",
                "In fringilla ultrices aliquet",
                "Donec non metus consectetur"
            ]
        }
    ]
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id