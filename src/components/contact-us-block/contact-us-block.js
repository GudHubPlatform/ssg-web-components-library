import html from './contact-us-block.html';
import './contact-us-block.scss';

import jsonTemplate from './contact-us-block-data.json';

class ContactUsBlock extends GHComponent {

    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);
        this.subtitle = this.json.subtitle;
        
        this.info = window.getConfig().componentsConfigs.generalInfo[0];

        this.manyPhones = Array.isArray(this.info.phone);
        
        this.phones = this.manyPhones ? this.info.phone : new Array(this.info.phone);
        
        this.customPhoneIcon = this.json.customPhoneIcon;
        this.customMailIcon = this.json.customMailIcon;
        this.customAddressIcon = this.json.customAddressIcon;

        super.render(html);
    }
}
window.customElements.define('contact-us-block', ContactUsBlock);