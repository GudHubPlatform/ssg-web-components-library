# Attributes:

```data-heading-outer``` - if this attribute exist - heading tag will placed above flex-wrapper

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title?": "Title",
    "subtitle?": "Subtitle",
    "list?": ["first element", "second element", "third element"],
    "buttons?": {
        "primary": {
            "link?": "#",
            "popupId?": "popupId",
            "placement": "media-and-text",
            "text": "button text"
        },
        "secondary": {
            "link?": "#",
            "popupId?": "popupId",
            "placement": "media-and-text",
            "text": "button text"
        }
    },
    "image": {
        "src": "/assets/images/homepage/interfejs-crm-systemy-dlja-byznesu-gud-hub.png",
        "alt": "Огляд інтерфейсу CRM системи для бизнесу GudHub",
        "title": "Інтерфейс CRM системи для бизнесу GudHub"
    }
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id