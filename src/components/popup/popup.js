import html from './popup.html';
import './popup.scss';

class Popup extends GHComponent {

    constructor() {
        super();
        this.popupId = this.getAttribute('data-popup-id');
    }
    
    async onServerRender() {
        const child = this.innerHTML;
        super.render(html);
        const childContainer = this.getChildContainer();
        if (childContainer && child) {
            childContainer.innerHTML = child;
        }
    }

    onClientReady() {
        this.renderChild();
        if (this.hasAttribute('data-autostart')) {
            const delay = Number(this.getAttribute('data-autostart'));
            if (delay) {
                setTimeout(() => this.openPopup(), delay);
            }
        }
        window.addEventListener('open-popup', (e) => {
            if (this.popupId === e.detail.popupId) {
                if (this.child && this.child.tagName.toLowerCase() === 'get-in-touch-form') {
                    this.child.placement = e.detail.placement ? e.detail.placement : 'no-placement-attribute';
                }
                this.openPopup();
            }
        });
    }

    getChildContainer() {
        return this.getElementsByClassName('child-container')[0];
    }

    renderChild() {
        const childContainer = this.getChildContainer();
        this.child = childContainer.children[0];
        if (this.child && this.child.tagName) {
            customElements.whenDefined(this.child.tagName.toLowerCase()).then(() => {
                if (typeof this.child.clientRender === 'function') {
                    this.child.clientRender();
                } else {
                    console.warn('clientRender is not a function on', this.child);
                }
            });
        }
    }

    backgroundClosePopup() {
        if (event.target.className == 'background_shadow') {
            this.closePopup();
        }
    }

    openPopup() {
        this.classList.add('active');
    }

    closePopup() {
        this.classList.remove('active');
        this.child.onParentPopupClose();
    }
}

window.customElements.define('popup-container', Popup);