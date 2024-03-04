import html from './grid-item-numbered.html';
import './grid-item-numbered.scss';
import jsonTemplate from './grid-item-numbered-data.json';

class GridItemNumbered extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        this.number = this.getNumberFromGhId();

        if (this.ghId) {
            super.render(html);
        }
    }

    onClientReady() {
    }

    getNumberFromGhId() {
        if (this.ghId) {
            const lastDotIndex = this.ghId.lastIndexOf('.');
            if (lastDotIndex !== -1 && lastDotIndex < this.ghId.length - 1) {
                const substringAfterLastDot = this.ghId.substring(lastDotIndex + 1);
                if (!isNaN(substringAfterLastDot)) {
                    return (`${+substringAfterLastDot + 1}`).padStart(2, '0');
                }
            }
        }
        return '??';
    }
}

window.customElements.define('grid-item-numbered', GridItemNumbered);