import html from './overflow-cards.html';
import './overflow-cards.scss';
import jsonTemplate from './overflow-cards-data.json';

class OverflowCards extends GHComponent {

    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.ghId = this.getAttribute('data-gh-id') || null;
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.subtitle = this.hasAttribute('data-subtitle') ? this.getAttribute('data-subtitle') : true;

        const json = await super.getGhData(this.ghId);

        this.jsonData = json;

        this.cards = json.cards;
        this.button = json.button ? json.button : {"text": "Спробувати Безкоштовно", "class": 'btn'};

        super.render(html);
    }
}

window.customElements.define('overflow-cards', OverflowCards);