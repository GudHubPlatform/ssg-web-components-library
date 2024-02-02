import html from './service-image-counter.html';
import './service-image-counter.scss';
import jsonTemplate from './service-image-counter-data.json';

class ServiceImageCounter extends GHComponent {

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

window.customElements.define('service-image-counter', ServiceImageCounter);