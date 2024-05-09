import html from './get-in-touch-block.html';
import './get-in-touch-block.scss';
import jsonTemplate from './get-in-touch-block-data.json';

class GetInTouchBlock extends GHComponent {

    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }
    
    async onServerRender() {

        this.ghId = this.getAttribute('data-gh-id') || null;

        this.json = await super.getGhData(this.ghId);

        super.render(html);
    }
}
window.customElements.define('get-in-touch-block', GetInTouchBlock);