# How to customize
In json that used by component must be object "button", it can have 2 types: popup opener or redirect to link (be like a common <a> tag), it defines by "popupId"+"placement" or "link". Also you must write "text" property that will be displayed in button. 

# Button text
Button text defines in component innerText: <button-component>button text</button-component>

# Data-attributes
data-popup-id="popup-id": button will open popup, and "popup-id" determines which popup will be opened

href: button will be with tag <a> and open link from href attribute of component

data-placement: value of this attribute  will be in event details (for example it used in form to track which button user clicked)
