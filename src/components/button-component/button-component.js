import html from './button-component.html';
import './button-component.scss';

class ButtonComponent extends GHComponent {

    constructor() {
        super();
        this.popupId = this.hasAttribute('data-popup-id') ? this.getAttribute('data-popup-id') : null;
        this.placement = this.hasAttribute('data-placement') ? this.getAttribute('data-placement') : 'no-placement-attribute';
        this.link = this.hasAttribute('data-link') ? this.getAttribute('data-link') : null;
        this.tag = this.link ? `a href="${this.link}"` : 'div onclick="openPopup()"';
    }
    
    async onServerRender() {
        this.text = this.textContent != '' ? this.textContent : 'Замовити консультацію';
        if (this.link) {
            this.removeLink();
        }

        this.className = this.hasAttribute('class') ? this.getAttribute('class') : 'btn';

        super.render(html);
        this.removeAttribute('class');
    }

    openPopup () {
        window.dispatchEvent( new CustomEvent('open-popup', {
            detail: {
                popupId: this.popupId,
                placement: this.placement
            }
        }));
    }

    removeLink() {
        this.removeAttribute('link');
    }
}
window.customElements.define('button-component', ButtonComponent);