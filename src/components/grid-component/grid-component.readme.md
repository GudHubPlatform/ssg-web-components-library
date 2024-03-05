# Attributes:

data-items-in-row=[number]: to calculate item width in flex container;

be-slider: on mobile devices (max-width: 700px) grid-items will be displayed as slider;

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title?": "string",
    "subtitle?": "string",
	"button": {
		"link?": "#",
		"popupId?": "popupId",
		"placement": "grid-component",
		"text": "button text"
	},
    "items": [
	  {
        "title": "Lorem ipsum dolor sit amet",
        "text": "Aliquam ullamcorper nunc tempus molestie venenatis."
      },
      {
        "title": "Lorem ipsum dolor sit amet",
        "text": "Aliquam ullamcorper nunc tempus molestie venenatis."
      },
      {
        "title": "Lorem ipsum dolor sit amet",
        "text": "Aliquam ullamcorper nunc tempus molestie venenatis."
      },
      {
        "title": "Lorem ipsum dolor sit amet",
        "text": "Aliquam ullamcorper nunc tempus molestie venenatis."
      },
      {
        "title": "Lorem ipsum dolor sit amet",
        "text": "Aliquam ullamcorper nunc tempus molestie venenatis."
      },
      {
        "title": "Lorem ipsum dolor sit amet",
        "text": "Aliquam ullamcorper nunc tempus molestie venenatis."
      }
	]
}
```
## Button settings
Use "link" if button must be <a> and redirect to link
OR
Use "popupId" to open popup with that id