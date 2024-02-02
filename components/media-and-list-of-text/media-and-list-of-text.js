import html from './media-and-list-of-text.html';
import './media-and-list-of-text.scss';
import jsonTemplate from './media-and-list-of-text-data.json';

class MediaAndListOfText extends GHComponent {
    
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        this.json = await super.getGhData(this.ghId);

        this.subtitle = this.json.subtitle;
        this.items = this.json.items;

        super.render(html);
    }
}

window.customElements.define('media-and-list-of-text', MediaAndListOfText);