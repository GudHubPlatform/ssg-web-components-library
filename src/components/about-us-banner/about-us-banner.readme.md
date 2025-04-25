# Attributes:

if you need h1, set attribute 'h1' for example <about-us-banner h1></about-us-banner>, else it will be 'h2'

# Component data-object:

("?" means "unnecessary")

```json
{
  "title": "Title",
  "subtitle?": "subtitle",
  "buttons?": {
    "primary": {
      "link": "/link/",
      "popupId": "form",
      "placement": "about-us-banner",
      "text": "Primary"
    },
    "secondary": {
      "link": "/link/",
      "popupId": "form",
      "placement": "about-us-banner",
      "text": "Secondary"
    }
  },
  "image": {
    "src": "image path",
    "alt": "image alt",
    "title": "image title"
  }
}
```
