import html from './service-counter.html';
import './service-counter.scss';
import jsonTemplate from './service-counter-data.json';

class ServiceCounter extends GHComponent {

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

window.customElements.define('service-counter', ServiceCounter);