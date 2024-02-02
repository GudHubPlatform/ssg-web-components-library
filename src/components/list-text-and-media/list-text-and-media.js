import html from './list-text-and-media.html';
import './list-text-and-media.scss';
import jsonTemplate from './list-text-and-media-data.json';
class ListMediaAndText extends GHComponent {
    
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        this.json = await super.getGhData(this.ghId);

        this.items = this.json.items;

        super.render(html);
    }
}

window.customElements.define('list-text-and-media', ListMediaAndText);