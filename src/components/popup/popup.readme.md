
# Usage:
The component that should be in the popup is written inside the component: "<popup-container> <YOUR-COMPONENT> </popup-container>".
Also, on the user's client, the popup calls the "clientRender()" method, if it is defined in your component that is in the popup, it will be applied.

# Data-attributes:
data-popup-id="popup-id": there can be several popups on the page, so that the popup understands what exactly it should open with the id attribute. When the "open-popup" event si dispatched, the popup checks whether "e.detail.popupId" matches the id in the popup attribute.

data-autostart="time in milliseconds": popup will open itself after delay

data-no-bg-shadow: shadowed background will not appear

data-position="bottom-right": popup will be positioned in right bottom corner