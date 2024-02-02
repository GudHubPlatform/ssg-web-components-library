import html from './animation-block.html';
import './animation-block.scss';
import jsonTemplate from './animation-block-data.json';
class AnimationBlock extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        
        this.json = await super.getGhData(this.ghId);
        this.rows = this.json.rows;
        this.buttons = this.json.buttons;

        super.render(html);
    }

}

window.customElements.define('animation-block', AnimationBlock);