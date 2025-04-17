import html from './page-banner-with-video.html';
import './page-banner-with-video.scss';
import jsonTemplate from './page-banner-with-video-data.json'

class PageBannerWithVideo extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);
        this.breadcrumbs = this.getAttribute('data-breadcrumbs') || null;

        this.video = this.json.video.link || "https://www.w3schools.com/html/mov_bbb.mp4";
        this.type = this.json.video.link.split('.').slice(-1) || null;

        super.render(html);
    }
    onClientRender() {
        this.addEventListeners();
    }
    addEventListeners() {
        const poster = this.querySelector('.video-player image-component');
        const video = this.querySelector('.video-wrapper video');
        video.classList.add('hidden');

        video.addEventListener('canplaythrough', () => {
            poster.classList.add('hidden');
            video.classList.remove('hidden');

            video.play();
        });
    }
}

customElements.define('page-banner-with-video', PageBannerWithVideo);