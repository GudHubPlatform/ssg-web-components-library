# Attributes:

data-items-in-row=[number]: to calculate item width in flex container;

data-items-shadow: to turn on grid_item shadows;

data-border-top-on-hover: to add grid_item border top on hover



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