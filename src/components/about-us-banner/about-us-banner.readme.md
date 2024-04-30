# Attributes:

hLvl: determine type of h1 or h2 that will be applied to title

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title": "string",
    "subtitle": "string",
	"buttons?": {
		"primary": {
			"link?": "#",
			"popupId?": "popupId",
			"placement": "grid-component",
			"text": "button text"
		},
		"secondary": {
			"link?": "#",
			"popupId?": "popupId",
			"placement": "grid-component",
			"text": "button text"
		}
	},
    "image": "string",
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id