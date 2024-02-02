import html from './categories-list.html';
import './categories-list.scss';

import categoriesObject from './categories-list.json';

class CategoriesList extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {
        this.categories = await gudhub.jsonConstructor(categoriesObject);
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