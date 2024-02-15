import html from './text-only.html';
import './text-only.scss';
import jsonTemplate from './text-only-data.json';

class TextOnly extends GHComponent {
    
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        super.render(html);
    }

}

window.customElements.define('text-only', TextOnly);