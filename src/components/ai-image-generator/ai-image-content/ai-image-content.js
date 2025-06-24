import html from './ai-image-content.html';
import './ai-image-content.scss';

class AiImageContent extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        super.render(html);
    }

}

window.customElements.define('ai-image-content', AiImageContent);