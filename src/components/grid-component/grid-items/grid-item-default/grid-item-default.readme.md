# Attributes:

# Classes
	.items_title_underline: it works only for grid-item-default child component(add an underline with color transition on hover), if u need to change transition duration change --transition-duration in grid-component 

# Component data-object: 
("?" means "unnecessary")
```json
{
	"title?": "string",
	"button?": "string",
	"letter?": "symbol",
	"marker?": "symbol",
	"icon?": {
		"src": "string",
		"alt": "string",
		"title": "string",
	},
	"text?": "string",
	"list?": ["string"] // in most cases, either text or a list is used
}

```