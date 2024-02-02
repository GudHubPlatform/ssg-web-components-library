import html from './counter-section.html';
import './counter-section.scss';
import jsonTemplate from './counter-section-data.json';

class CounterSection extends GHComponent {

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

window.customElements.define('counter-section', CounterSection);