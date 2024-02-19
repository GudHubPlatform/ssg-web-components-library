import html from './about-us-banner.html';
import './about-us-banner.scss';
import jsonTemplate from './about-us-banner-data.json';

class AboutUsBanner extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        this.json = await super.getGhData(this.ghId);

        this.image = this.json.image;

        this.hLvl = this.hasAttribute('h1') ? 'h1' : 'h2';

        super.render(html);
    }

}

window.customElements.define('about-us-banner', AboutUsBanner);