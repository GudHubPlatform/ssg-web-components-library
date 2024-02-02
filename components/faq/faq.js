import html from './faq.html';
import './faq.scss';

class Faq extends GHComponent {
    /**
     * data-background - set background color in hex or rgb/a
     */
    constructor() {
        super();
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        const json = await super.getGhData(this.ghId);

        this.items = json.items;
        
        const background = this.hasAttribute('data-background') ? this.getAttribute('data-background') : '#fff';

        this.style.setProperty('--background', background);

        super.render(html);
    }

    openItem(item) {
        let items = this.querySelectorAll('.faq_item');
        if (item.classList.contains('active')) {
            item.classList.remove('active')
        } else {
            items.forEach(element => {
                element.classList.remove('active')
            });
            item.classList.add('active')
        }
    }

}

window.customElements.define('faq-component', Faq);