import html from './grid-component.html';
import './grid-component.scss';
import jsonTemplate from './grid-component-data.json';
import svgPlaceholder from '../svgPlaceholder.js'

class GridComponent extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);
        
        this.svgPlaceholder = svgPlaceholder;

        this.items = this.json.items;

        const gridItem = this.children[0];
        if (gridItem) {
            this.gridItemTag = gridItem.tagName.toLowerCase();
        }

        if (this.ghId) {
            super.render(html);
        }
    }

    onClientReady() {
    }

    openPopup (el) {
        const popupId = el.getAttribute('data-popup-id');
        window.dispatchEvent( new CustomEvent('open-popup', {
            detail: {
                popupId,
                placement: this.tagName.toLowerCase()
            }
        }));
    }
}

window.customElements.define('grid-component', GridComponent);