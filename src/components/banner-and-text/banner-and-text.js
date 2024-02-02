import html from './banner-and-text.html';
import './banner-and-text.scss';
import jsonTemplate from './banner-and-text-data.json';

class BannerAndText extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.ghId = this.getAttribute('data-gh-id') || null;
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.chapter = this.getAttribute('data-chapter') || 'pages';
        
        this.json = await super.getGhData(this.ghId, this.chapter);

        this.items = this.json.items;
        this.image = this.json.image;

        super.render(html);
    }
}

window.customElements.define('banner-and-text', BannerAndText);