import html from './categories-list.html';
import './categories-list.scss';

import generateCategoriesListScheme from './categories-list-scheme.js';

class CategoriesList extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {

        this.config = JSON.parse(this.getAttribute('data-config')) || null;
        this.categories = await gudhub.jsonConstructor(generateCategoriesListScheme(window.constants.chapters.blog));


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