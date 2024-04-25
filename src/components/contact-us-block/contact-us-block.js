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
        
        this.info = window.getConfig().generalInfo;

        // TODO: Migrate commented code to multilanguage branch

        // const currentLanguage = window.getConfig().currentLanguage;
        // if (currentLanguage) {
        //     this.info = window.getConfig().componentsConfigs.generalInfo.find(info => info.langCode === currentLanguage);
        // } else {
        //     this.info = window.getConfig().componentsConfigs.generalInfo;
        // }

        this.hrefPhone = this.info.phone.replace(/[ ()+-]/g, '');
        
        super.render(html);
    }
}
window.customElements.define('contact-us-block', ContactUsBlock);