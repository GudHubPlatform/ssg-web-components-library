import html from './homepage-banner.html';
import './homepage-banner.scss';

class HomepageBanner extends GHComponent {
    constructor() {
        super();
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