import html from './info-table.html';
import './info-table.scss';
import jsonTemplate from './info-table.json';

class InfoTable extends window.GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId, 'areas');

        console.log("AAAAAAAAAAAAAAAAAAAAAAAA", this.json);

        if (this.json) {
            super.render(html);
        }
    }
}

window.customElements.define('info-table', InfoTable);
