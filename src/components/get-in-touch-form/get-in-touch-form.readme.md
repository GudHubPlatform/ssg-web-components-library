# Config: 
The form field settings are defined in the site's config.mjs, when rendered on the server it is stored in "window.constants.form_config", and this config is also defined in the client's "window.website_config.form" and is used when rendering the form on the client. If the config in "window" is not available, then the config is taken from "get-in-touch-form-data.json". There can be several settings for forms, the form selects it by id (it is defined in the "data-form-id" attribute of the form component), this allows you to customize the fields of several forms in different ways (for example, on the page the form has all the fields, and in the popup the form has other types of fields)

# Form in popup:
if form will be rendered in popup we need to define attribute "data-in-popup", that will change some styles of form to fit the popup styles.

# Placement:
The "placement" variable is needed to track conversions. If the form is in a popup, then "placement" determined by the button that opened the popup with the form. If the form is already on the page, this value is defined in the form constructor (currently "this.placement = 'main' ").

# Data-attributes:
data-in-popup: if form is on popup
data-form-id="form-id": determine id of config that will be applyed to form

# Config object: 
("?" means "unnecessary")
```json
{
        "id": "string",
        "title?": "string",
        "subtitle?": "string",
        "mailConfig": {
            "to": "string",
            "from": "string",
            "subject": "string"
        },
        "inputs": [
            {
                "name": "string",
                "type": "type",
                "required": "boolean",
                "placeholder": "Ім'я *",
                "width": "number from 1 to 12"
            }
        ]
    },
```
## Types description:
email: will be checked by email rules;
phone: will be checked by phone number rules;
short: max length 64 symbols;
long: max length 128 symbols;
textarea: tag "<textarea>";

## Width:
defines the width of the field in the row. The total width of the row is 12. That is, if 2 fields have a width of 6, then they will take up half of the line each