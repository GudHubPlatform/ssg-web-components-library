import html from './prices-cards.html';
import './prices-cards.scss';
import jsonTemplate from './prices-cards-data.json';
class PricesCards extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.ghId = this.getAttribute('data-gh-id') || null;
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.application = this.hasAttribute('application') ? this.getAttribute('application') : undefined;
        
        const json = await super.getGhData(this.ghId, this.application);

        this.cards = json.cards;

        super.render(html);
    }
}

window.customElements.define('prices-cards', PricesCards);