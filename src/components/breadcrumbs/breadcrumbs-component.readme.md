# Attributes:

None

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