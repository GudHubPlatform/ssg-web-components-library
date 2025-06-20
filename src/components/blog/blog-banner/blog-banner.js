import html from './blog-banner.html';
import './blog-banner.scss';

import {initBlogConfig} from '../initBlogConfig.js';

class BlogBanner extends GHComponent {

    constructor() {
        super();
        const homepageAttr = this.getAttribute('data-homepage');
        try {
            this.homepageObj = homepageAttr && JSON.parse(homepageAttr);
        } catch (e) {
            console.warn('Invalid data-homepage JSON:', `data-homepage='{"title": "Головна", "link": "/"}'`);
            this.homepageObj = { title: 'Головна', link: '/' };
        }
    }

    async onServerRender() {
        this.config = initBlogConfig(window.getConfig().componentsConfigs.blog_config[0]);

        let url = new URL(window.location.href);
        url = url.searchParams.get('path');
        this.slug = url;
        // if this a pagination page (/blog/page/2/), set in the breadcrumbs only one item (Home > Blog)
        if (url.includes('/page/')) {
            this.page = true;
            this.breadcrumbs = JSON.stringify([{"title": this.config.breadcrumbs.blog}])
            this.ghId = this.getAttribute('data-gh-id') || null;
            
            // this.json = await super.getGhData(this.ghId, 'pages', window.getConfig().chapters.pages.app_id, window.getConfig().chapters.pages.blog_main_page_item_id);
            const response = await gudhub.getDocument({ app_id: window.getConfig().chapters.pages.app_id, item_id: window.getConfig().chapters.pages.blog_main_page_item_id, element_id: window.getConfig().chapters.pages.json_field_id });
            this.json = JSON.parse(response.data)[this.ghId];

        } else {
            this.page = false;
            this.ghId = this.getAttribute('data-gh-id') || null;
            this.json = await super.getGhData(this.ghId);
            
            this.button = this.json.button || null;
            if (!this.json.button) {
                this.classList.add('without_button');
            }
            
            let breadcrumbsTitle = document.createElement('div')
            breadcrumbsTitle.innerHTML = this.json.title;
            
            this.breadcrumbs = JSON.stringify([
                this.homepageObj,
                {
                    title: breadcrumbsTitle.innerText
                }
            ]);
            
            this.image = this.json.image || false;
        }

        super.render(html);
    }
}

window.customElements.define('blog-banner', BlogBanner);