import html from './media-and-text.html';
import './media-and-text.scss';
import jsonTemplate from './media-and-text-data.json';

class MediaAndText extends GHComponent {
    
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        this.json = await super.getGhData(this.ghId);

        this.title = this.json.title;
        this.subtitle = this.json.subtitle;
        this.text = this.json.text;
        this.buttons = this.json.buttons;
        this.list = this.json.list;

        super.render(html);
    }

}

window.customElements.define('media-and-text', MediaAndText);