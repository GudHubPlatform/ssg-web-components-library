import html from './get-in-touch-block-with-image.html';
import './get-in-touch-block-with-image.scss';
import jsonTemplate from './get-in-touch-block-with-image-data.json';


class GetInTouchBlockWithImage extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.getFormAttributes = this.getFormAttributes;
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.currentPage = this.getAttribute('data-page') || null;

        this.json = this.currentPage
            ? await super.getGhData(this.ghId, 'pages', this.currentPage)
            : await super.getGhData(this.ghId);

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

window.customElements.define('get-in-touch-block-with-image', GetInTouchBlockWithImage);