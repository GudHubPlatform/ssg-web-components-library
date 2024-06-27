# Work types

    We have two different ways to use this component: 

        1. Automatically: looks on URL of the page, finds path in three of routes (got from "breadcrumbsConfig") and builds breadcrumbs chain 
        2. Manually: set attribute "data-items" which will display 
            Manually example: 
 ```                   
                js: this.breadcrumbs = JSON.stringify([
                        {
                            title: 'string',
                            link: '/'
                        },
                        {
                            title: "string"
                        }
                    ]);
 ```                   
                html: <breadcrumbs-component data-items='${breadcrumbs}'></breadcrumbs-component>

# Attributes:

    data-items: allows for manual mode activation, parsing JSON-formatted data passed to it, and assigning the resulting JavaScript object to the items property of the current element.

# Component data-object:

("?" means "unnecessary")

```config file
[
    {
        langCode: 'string',
        defaultLang: boolean,
        routesTree: {
            title: "string",
            link?: "string",
            childs?: [
                {
                    title: "string",
                    link?: "string",
                    image?: {
                        src: "string",
                        alt: "string",
                        title: "string"
                    }
                }
            ]
        }
    }
]
```