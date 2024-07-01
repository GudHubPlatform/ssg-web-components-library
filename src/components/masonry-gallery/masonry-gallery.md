# Description

    To implement the functionality of the "Load more" button, we need to pass two values ​​to the JSON: `initCount` and `moreCount`, or just `initCount`.
        1. If only `initCount` is passed in the JSON, clicking the "Load more" button will open all photos at once.
        
        2. If only `moreCount` without `initCount` is passed in the JSON, the Load More button will not appear and all images will be displayed at once.

        3. If both values ​​are passed in JSON, then the number of images specified in `initCount` will be displayed first. 
           Clicking the "Upload more" button will load additional images, the number of which corresponds to the `moreCount' value.

    If you need to stretch image on full width of screen, you can set "data-column-width" attribute equal to 0 (zero).

# Variants

    We have two options how you can use this component:
        1. When items it's array with objects where we can have as a key image 
        2. When items it's object with endpoint for fetching data with images

# Attributes:

    data-column-width: we need to pass column width value (number), for gap between grid items
    data-modal-button: we need to write text for button as a value, this attribute use for contact-us button in modal window 
    data-modal-button-id: we need to write id for button popup-id as a value, this attribute use for contact-us button in modal window

# Component data-object:

("?" means "unnecessary")

```json

    #Variant-1

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
            "moreItems?": [ // images which will be added to layout when you press the button
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

    #Variant-2
    
        {
            "title?": "Item Title",
            "subtitle?": "Item Subtitle",
            "button?": "Button text",
            "items": {
                "url": "Endpoint for fetching",
                "initCount": "number",
                "moreCount": "number"
            }
        }

```

## Button settings
