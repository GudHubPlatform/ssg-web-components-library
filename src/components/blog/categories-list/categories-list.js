import html from './categories-list.html';
import './categories-list.scss';

import generateCategoriesListScheme from './categories-list-scheme.js';
import { generateSlugFilterByLanguage } from '../schemeFilters.js';

class CategoriesList extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {

        this.config = JSON.parse(this.getAttribute('data-config')) || null;

        const clientConfig = window.getConfig();
        const blogChapter = clientConfig.chapters.blog;

        const categoriesListScheme = generateCategoriesListScheme(blogChapter);
        if (clientConfig.multiLanguage) {
            const { slug_field_id } = blogChapter;
            categoriesListScheme.filter.push(generateSlugFilterByLanguage(slug_field_id));
        }

        this.categories = await gudhub.jsonConstructor(categoriesListScheme);

        this.categories = this.categories.categories;
        this.url = new URL (window.location.href);
        this.url = this.url.searchParams.get('path');
        super.render(html);
    }

    openList(item) {
        item.classList.toggle('active');
    }

}

window.customElements.define('categories-list', CategoriesList);