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
        
        this.defaultPhoneIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"><g clip-path="url(#clip0_1428_29328)"><path d="M22.3204 17.1261C21.6107 16.4098 20.6649 16.0155 19.6566 16.0155C19.6556 16.0155 19.6545 16.0155 19.6535 16.0155C18.6442 16.0163 17.6978 16.4122 16.9885 17.1304L15.4698 18.668C11.8226 17.1394 8.90841 14.2224 7.38191 10.5773L8.93201 9.00779C10.3827 7.53899 10.3699 5.1619 8.90336 3.70885L5.36176 0.199707H5.05312C2.37882 0.199707 0.203125 2.3754 0.203125 5.0497C0.203125 7.85059 0.751874 10.5681 1.83402 13.1267C2.87917 15.5977 4.37522 17.8167 6.28061 19.7221C8.18601 21.6275 10.4051 23.1236 12.876 24.1687C15.4346 25.2509 18.1522 25.7997 20.9531 25.7997C23.6274 25.7997 25.8031 23.624 25.8031 20.9497V20.6411L22.3204 17.1261ZM20.9531 24.2997C10.3386 24.2997 1.70312 15.6642 1.70312 5.0497C1.70312 3.30205 3.04817 1.8627 4.75752 1.71265L7.84756 4.7743C8.72746 5.64615 8.73521 7.07239 7.86476 7.95369L5.63031 10.2161L5.80246 10.6671C7.46651 15.0268 10.9135 18.5018 15.2596 20.2011L15.8398 20.4279L18.0557 18.1844C18.4813 17.7535 19.0491 17.516 19.6547 17.5155C19.6554 17.5155 19.656 17.5155 19.6566 17.5155C20.2615 17.5155 20.829 17.7521 21.2548 18.1818L24.2902 21.2453C24.1401 22.9546 22.7007 24.2997 20.9531 24.2997Z" fill="white"/><path d="M22.0529 3.9488C19.6353 1.5312 16.4209 0.199707 13.002 0.199707V1.6997C19.2328 1.6997 24.3019 6.76884 24.3019 12.9997H25.8019C25.8019 9.58069 24.4705 6.36635 22.0529 3.9488Z" fill="white"/><path d="M13.002 4.69971V6.1997C16.7515 6.1997 19.8019 9.25015 19.8019 12.9997H21.3019C21.3019 8.42305 17.5786 4.69971 13.002 4.69971Z" fill="white"/></g><defs><clipPath id="clip0_1428_29328"><rect width="25.6" height="25.6" fill="white" transform="translate(0.199219 0.200195)"/></clipPath></defs></svg>`;
        this.defaultMailIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><g clip-path="url(#clip0_1428_29305)"><mask id="mask0_1428_29305" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30"><path d="M0.902344 0.919592H29.0623V29.0796H0.902344V0.919592Z" fill="white"/></mask><g mask="url(#mask0_1428_29305)"><path d="M1.72656 5.15522H28.2366V24.8452H1.72656V5.15522Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10"/><path d="M1.7207 5.155L14.9757 17.75L28.2307 5.155" stroke="white" stroke-width="1.5" stroke-miterlimit="10"/><path d="M1.7207 24.8452L11.6517 14.5917" stroke="white" stroke-width="1.5" stroke-miterlimit="10"/><path d="M28.2278 24.8452L18.2969 14.5917" stroke="white" stroke-width="1.5" stroke-miterlimit="10"/></g></g><defs><clipPath id="clip0_1428_29305"><rect width="28.16" height="28.16" fill="white" transform="translate(0.919922 0.919922)"/></clipPath></defs></svg>`;
        this.defaultAddressIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="29" viewBox="0 0 24 29" fill="none"><g clip-path="url(#clip0_1428_29403)"><path d="M12.0535 14.2955C10.984 14.2955 9.91434 13.8884 9.10029 13.0741C7.47178 11.4458 7.47178 8.79617 9.10029 7.16766C9.88898 6.37875 10.9379 5.94434 12.0535 5.94434C13.1692 5.94434 14.2179 6.37896 15.0068 7.16766C16.6353 8.79617 16.6353 11.4458 15.0068 13.0741C14.1925 13.8884 13.123 14.2955 12.0535 14.2955ZM12.0535 7.59756C11.4071 7.59756 10.7606 7.84355 10.2684 8.33576C9.28398 9.32018 9.28398 10.9218 10.2684 11.9062C10.7451 12.383 11.3791 12.6455 12.0535 12.6455C12.7279 12.6455 13.3619 12.383 13.8387 11.9062C14.8231 10.9218 14.8231 9.32018 13.8387 8.33576C13.3465 7.84355 12.7 7.59756 12.0535 7.59756Z" fill="white"/><path d="M12.0675 28.5799L11.4288 27.8297C11.0549 27.3903 2.26953 16.9919 2.26953 10.2082C2.26953 4.8109 6.66051 0.419922 12.0578 0.419922C17.4551 0.419922 21.8461 4.8109 21.8461 10.2082C21.8461 16.6582 13.0684 27.3673 12.6948 27.82L12.0675 28.5799ZM12.0578 2.07186C7.57145 2.07186 3.92146 5.72184 3.92146 10.2082C3.92146 12.7296 5.42494 16.3785 8.26947 20.7607C9.74566 23.0348 11.2322 24.9607 12.0488 25.9799C12.8667 24.9327 14.3674 22.9435 15.8528 20.6262C18.693 16.1959 20.1942 12.5932 20.1942 10.2082C20.1942 5.72184 16.5442 2.07186 12.0578 2.07186Z" fill="white"/></g><defs><clipPath id="clip0_1428_29403"><rect width="28.16" height="28.16" fill="white" transform="translate(-2.08008 0.419922)"/></clipPath></defs></svg>`;

        this.customPhoneIcon = `<img src="${this.json.customPhoneIcon}" alt="phone icon" title="phone icon"></img>`
        this.customMailIcon = `<img src="${this.json.customMailIcon}" alt="phone icon" title="mail icon"></img>`
        this.customAddressIcon = `<img src="${this.json.customAddressIcon}" alt="phone icon" title="address icon"></img>`

        this.phoneIcon = this.json.customPhoneIcon ? this.customPhoneIcon : this.defaultPhoneIconSvg;
        this.mailIcon = this.json.customMailIcon ? this.customMailIcon : this.defaultMailIconSvg;
        this.addressIcon = this.json.customAddressIcon ? this.customAddressIcon : this.defaultAddressIconSvg;

        super.render(html);
    }
}
window.customElements.define('contact-us-block', ContactUsBlock);