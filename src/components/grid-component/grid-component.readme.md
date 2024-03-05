# Attributes:

data-items-in-row=[number]: to calculate item width in flex container;

be-slider: on mobile devices (max-width: 700px) grid-items will be displayed as slider;

# Component data-object: 
("?" means "unnecessary")
```json
{
    "title?": "string",
    "subtitle?": "string",
    "button_text?": "string",
    "items": [ {
    	"title?": "string",
    	"link?": "string",
    	"letter?": "symbol",
		"marker?": "symbol",
    	"icon?": {
    		"src": "string",
    		"alt": "string",
    	    "title": "string",
    	},
    	"text?": "string",
    	"list?": ["string"] // in most cases, either text or a list is used
    } ]
}
```