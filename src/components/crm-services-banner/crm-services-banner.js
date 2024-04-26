import html from './crm-services-banner.html';
import './crm-services-banner.scss';
import jsonTemplate from './crm-services-banner-data.json';

class CrmServicesBanner extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.headingOuter = this.hasAttribute('data-heading-outer') || null;

        this.json = await super.getGhData(this.ghId);

        this.list = this.json.list;
        this.texts = this.json.texts;

        this.image = this.json.image;

        super.render(html);
    }

}

window.customElements.define('crm-services-banner', CrmServicesBanner);