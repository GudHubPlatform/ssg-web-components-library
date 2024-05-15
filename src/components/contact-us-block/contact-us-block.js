import html from './contact-us-block.html';
import './contact-us-block.scss';
import { defaultIcons } from './default-icons';

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

        this.customPhoneIcon = `<img src="${this.json.customPhoneIcon}" alt="phone icon" title="phone icon"></img>`
        this.customMailIcon = `<img src="${this.json.customMailIcon}" alt="phone icon" title="mail icon"></img>`
        this.customAddressIcon = `<img src="${this.json.customAddressIcon}" alt="phone icon" title="address icon"></img>`

        this.phoneIcon = this.json.customPhoneIcon ? this.customPhoneIcon : defaultIcons.phone;
        this.mailIcon = this.json.customMailIcon ? this.customMailIcon : defaultIcons.mail;
        this.addressIcon = this.json.customAddressIcon ? this.customAddressIcon : defaultIcons.address;

        super.render(html);
    }
}
window.customElements.define('contact-us-block', ContactUsBlock);