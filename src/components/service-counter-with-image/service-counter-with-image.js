import html from './service-counter-with-image.html';
import './service-counter-with-image.scss';
import jsonTemplate from './service-counter-with-image-data.json';


class ServiceCounterWithImage extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        super.render(html);
    }
}

window.customElements.define('service-counter-with-image', ServiceCounterWithImage);