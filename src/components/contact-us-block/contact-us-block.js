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
        
        const currentLanguage = window.getConfig().currentLanguage;
        if (currentLanguage) {
            this.info = window.getConfig().componentsConfigs.generalInfo.find(info => info.langCode === currentLanguage);
        } else {
            this.info = window.getConfig().componentsConfigs.generalInfo;
        }

        this.manyPhones = Array.isArray(this.info.phone);
        
        this.phones = this.manyPhones ? this.info.phone : new Array(this.info.phone);
        
        super.render(html);
    }
}
window.customElements.define('contact-us-block', ContactUsBlock);