import html from './about-us-image-counter.html';
import './about-us-image-counter.scss';
import jsonTemplate from './about-us-image-counter-data.json';

class AboutUsImageCounter extends GHComponent {

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

window.customElements.define('about-us-image-counter', AboutUsImageCounter);