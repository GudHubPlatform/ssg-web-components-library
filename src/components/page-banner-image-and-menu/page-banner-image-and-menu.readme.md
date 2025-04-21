# Attributes:

if u need breadcrumbs use this: data-breadcrumbs='[{"title": "Home", "link": "/"}, {"title": "Some title"}]'

Also check scss file for better styling the component

# Component data-object:

("?" means "unnecessary")

```json
{
    "title": "Title",
    "subtitle?": "Subtitle",
    "image": {
        "src": "path to photo",
        "alt": "photo`s alt",
        "title": "photo`s title"
    },
    "button?": {
        "link": "link",
        "popupId": "popupId",
        "placement": "placement",
        "text": "Button Text"
    },
    "menu?": [
      {
        "title": "Example link",
        "link": "/components/#1"
      }
    ]
}
```