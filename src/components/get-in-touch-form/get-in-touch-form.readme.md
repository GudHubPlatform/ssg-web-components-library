# Config:

The form field settings are defined in the site's config.mjs, when rendered on the server it is stored in "window.getConfig().componentsConfigs.form_config", and this config is also defined in the client's "window.getConfig().componentsConfigs.formConfig" and is used when rendering the form on the client. If the config in "window" is not available, then the config is taken from "get-in-touch-form-data.json". There can be several settings for forms, the form selects it by id (it is defined in the "data-form-id" attribute of the form component), this allows you to customize the fields of several forms in different ways (for example, on the page the form has all the fields, and in the popup the form has other types of fields)

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
        "langCode": "string", //two or two-two symbols (en or en-GB)
        "defaultLang": Boolean,
        "title?": "string",
        "subtitle?": "string",
        "button_text?": "string",
        "mailConfig": {
            "to": "string",
            "from": "string",
            "subject": "string"
        },
        "endpointForEmails": "some fancy url for gudhub API",
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
textarea: tag "textarea";

## Width:

defines the width of the field in the row. The total width of the row is 12. That is, if 2 fields have a width of 6, then they will take up half of the line each

## Correct way to handle submit in your project

```js
// by default this event handled in your main.js
window.addEventListener("submitForm", async (event) => {
  const { formDataObj } = event.detail;

  // add other code here
});
```

### What data contains in formDataObj

```js
{
FormData :
    // all data from your form inputs on website
    name : "name"
    phone: "phhone"
    email: 'email'
FormId:
    // data from your form-config
    button_text:"text"
    defaultLang: "true or false"
    id: "text"
    inputs: Array()
        0: {name: 'name', type: 'type', required: 'required', placeholder: "placeholder", width: 12}
        1: {name: 'name', type: 'type', required: 'required', placeholder: 'placeholder *', errorText: 'errorText', …}
        langCode: "text"
    mailConfig:
        from: "from"
        subject: "subject"
        to: "to"
        subtitle: "subtitle"
        subtitleSuccess: "subtitleSuccess"
        title: "title"
        titleFail:"titleFail"
        titleSuccess: "titleSuccess"
FormPlacement: "FormPlacement"
Referrer: "Referrer"
Url: "/"
Website: "Website"
}
```
