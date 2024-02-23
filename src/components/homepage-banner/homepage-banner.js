import html from './homepage-banner.html';
import './homepage-banner.scss';

import jsonTemplate from './homepage-banner-data.json';
class HomepageBanner extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        this.json = await super.getGhData(this.ghId);

        this.list = this.json.list;

        this.image = this.json.image;

        super.render(html);
    }

}

window.customElements.define('homepage-banner', HomepageBanner);