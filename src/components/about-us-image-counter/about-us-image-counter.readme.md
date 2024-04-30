# Attributes:

nothing

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title": "string",
    "subtitle": "string",
    "items": [
        {
            "icon": {
                "src": "string",
                "alt": "string",
                "title": "string",
            }
        }
    ]
	"button?": {
		"link?": "#",
		"popupId?": "popupId",
		"placement": "grid-component",
		"text": "button text"
	},
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id