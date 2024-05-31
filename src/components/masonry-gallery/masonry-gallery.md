# Attributes:

    data-column-width: we need to pass column width value (number), for gap between grid items
    data-modal-button: we need to write text for button as a value, this attribute use for contact-us button in modal window 
    data-modal-button-id: we need to write id for button popup-id as a value, this attribute use for contact-us button in modal window

# Component data-object:

("?" means "unnecessary")

```json
    {
        "title?": "Item Title",
        "subtitle?": "Item Subtitle",
        "button?": "Button text",
        "items": [ // main set of images for first render
            {
                // basicly grid was created for 3 columns, it can be changed by changing .grid-item width(it accepts value in percents) 
                "image": {
                    "src": "Path To File", // path should be like '/assets/...../photo1.png' and changing only the numbers for the others images in the end of name of the file
                    "alt": "Item Alt",
                    "title": "Item Title",
                    "fullImage?": "Path To File" // it must be image for modal window, when we click on image from grid
                }
            }
        ],
        "moreItems": [ // images which will be added to layout when you press the button
            {
                "image": {
                    "src": "Path To File", // path should be like '/assets/...../photo1.png' and changing only the numbers for the others images in the end of name of the file
                    "alt": "Item Alt",
                    "title": "Item Title",
                    "fullImage?": "Path To File" // it must be image for modal window, when we click on image from grid
                }
            }
        ]
    }
```

## Button settings
