import html from './cookies-popup.html';
import './cookies-popup.scss';

class CookiesPopup extends GHComponent {
    
    constructor() {
        super();
    }

    async onServerRender() {
        super.render(html);
    }

    onClientReady () {
        if ( localStorage.getItem('agreeWithCookies') == null ) {
            this.classList.add('show');
        }
    }

    gotIt() {
        this.classList.add('hide');
        localStorage.setItem('agreeWithCookies', true);
    }

}

window.customElements.define('cookies-popup', CookiesPopup);