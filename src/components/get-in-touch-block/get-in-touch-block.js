import html from './get-in-touch-block.html';
import './get-in-touch-block.scss';
import jsonTemplate from './get-in-touch-block-data.json';

class GetInTouchBlock extends GHComponent {

    constructor() {
        super();
        super.setDefaultData(jsonTemplate);

        this.getFormAttributes = this.getFormAttributes;
    }
    
    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        this.getFormAttributes = this.getFormAttributes.bind(this);

        super.render(html)
    }
    
    getFormAttributes() {
        this.formId = this.hasAttribute('data-form-id') ? this.getAttribute('data-form-id') : 'main';
        this.titleName = this.hasAttribute('data-form-title') ? this.getAttribute('data-form-title') : null;
        this.subtitleName = this.hasAttribute('data-form-subtitle') ? this.getAttribute('data-form-subtitle') : null;
        this.placement = this.hasAttribute('data-form-placement') ? this.getAttribute('data-form-placement') : "main";
        this.buttonText = this.hasAttribute('data-form-button-text') ? this.getAttribute('data-form-button-text') : null;
        
        const attributes = [{
            'data-form-id': this.formId,
            'data-form-title': this.titleName,
            'data-form-subtitle': this.subtitleName,
            'data-form-placement': this.placement,
            'data-form-button-text': this.buttonText,
        }];
        
        const attributesString = attributes.reduce((acc, obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                if (!!value) {
                    acc += `${key}="${value}"`;
                }
            });
            return acc;
        }, '');
        
        return attributesString;
    }
}
window.customElements.define('get-in-touch-block', GetInTouchBlock);