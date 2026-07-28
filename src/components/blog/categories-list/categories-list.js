import html from './categories-list.html';
import './categories-list.scss';

import generateCategoriesListScheme from './categories-list-scheme.js';
import { generateLanguageFilters, getBlogRootLink } from '../language.js';
import { initBlogConfig } from '../initBlogConfig.js';

class CategoriesList extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {
        this.config = JSON.parse(this.getAttribute('data-config'))
            || initBlogConfig(window.getConfig().componentsConfigs.blog_config);

        console.log("this.config:", this.config);

        const clientConfig = window.getConfig();
        const blogChapter = clientConfig.chapters.blog;

        const categoriesListScheme = generateCategoriesListScheme(blogChapter);
        categoriesListScheme.filter.push(...generateLanguageFilters(blogChapter.slug_field_id));

        this.categories = await gudhub.jsonConstructor(categoriesListScheme);

        this.categories = this.categories.categories;
        this.url = new URL (window.location.href);
        this.url = this.url.searchParams.get('path');
        this.allArticlesButtonLink = this.config.general_settings.all_articles_button_link || getBlogRootLink()
        super.render(html);
    }

    openList(item) {
        item.classList.toggle('active');
    }

}

window.customElements.define('categories-list', CategoriesList);