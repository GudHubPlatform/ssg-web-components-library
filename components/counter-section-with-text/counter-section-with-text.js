import html from './counter-section-with-text.html';
import './counter-section-with-text.scss';
import jsonTemplate from './counter-section-with-text-data.json';

class CounterSectionWithText extends GHComponent {

    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        this.json = await super.getGhData(this.ghId);
        this.items = this.json.items;

        super.render(html);
    }

}

window.customElements.define('counter-section-with-text', CounterSectionWithText);