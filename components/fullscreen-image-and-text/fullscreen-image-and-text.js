import html from './fullscreen-image-and-text.html';
import './fullscreen-image-and-text.scss';

class FullscreenImageAndText extends GHComponent {
    /**
     * class="light_theme", default theme is dark
     * class="reverse" reverse blocks
     */
    constructor() {
        super();
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        this.json = await super.getGhData(this.ghId);

        this.paragraphs = this.json.paragraphs;

        this.lists = this.json.lists ? this.json.lists : false;

        this.image = this.json.image;

        super.render(html);
    }

}

window.customElements.define('fullscreen-image-and-text', FullscreenImageAndText);