import html from './category-banner.html';
import './category-banner.scss';

import {initBlogConfig} from '../initBlogConfig.js';

class CategoryBanner extends GHComponent {
    /**
     * data-chapter - blog, default - page
     */
    constructor() {
        super();
    }

    async onServerRender() {

        this.config = initBlogConfig(window.getConfig().componentsConfigs.blog_config[0]);

        let chapter = this.getAttribute('data-chapter')
        let url = new URL(window.location.href);
        let route = url.searchParams.get('path');
        let slug;
        if (route.includes('/page/')) {
            route = route.slice(1, route.length - 1);
            route = route.split('/');
            slug = `/${route[0]}/${route[1]}/`;
        } else {
            slug = false;
        }

        // This algorithm with findIds we use because pagination pages is not exist in gudhub application and can't get data from their items
        let ids = await super.findIds(chapter, slug);
        const items = await gudhub.getItems(ids.appId);
        const item = items.find(item => item.item_id == ids.itemId);

        let description = await fetch(`https://gudhub.com/userdata/${ids.appId}/${item.fields.find(field => field.field_id == window.getConfig().chapters.blog.description_field_id).field_value}.html?t=${new Date().getTime()}`);
        description = await description.text();

        let div = document.createElement('div');
        div.innerHTML = description;
        this.description = div.querySelector('div').innerText;
        this.title = item.fields.find(field => field.field_id == window.getConfig().chapters.blog.heading_field_id).field_value;

        this.breadcrumbs = JSON.stringify([
            {
                "title": this.config.breadcrumbs.homepage || "Головна",
                "link": this.config.breadcrumbs.homepageLink || "/"
            },
            {
                "title": this.config.breadcrumbs.blog || "Блог",
                "link": this.config.breadcrumbs.blogLink || "/blog/"
            },
            {
                "title": this.title
            }
        ]);
        
        super.render(html);
    }
}

window.customElements.define('category-banner', CategoryBanner);