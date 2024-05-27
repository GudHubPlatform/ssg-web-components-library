import html from './grid-item-numbered.html';
import './grid-item-numbered.scss';

class GridItemNumbered extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        this.itemIndex = this.getAttribute('data-item-index') || null;
        this.generalGhId = this.getAttribute('data-gh-id') || null;
        this.ghId = `${this.generalGhId}.items.${this.itemIndex}`;
        this.generalJson = await super.getGhData(this.generalGhId);
        this.json = this.generalJson ? this.generalJson.items[this.itemIndex] : null;
        this.number = this.getNumberFromGhId();
        if (this.json?.customNumber) {
            const removeZeroPrefix = (string) => {
                if (string[0] === '0')  {
                    return string.slice(1);
                }
                return string;
            }

            const numberFormatted = removeZeroPrefix(this.number);
            this.number = this.json.customNumber.replace('{{number}}', numberFormatted);
        }
        
        if (this.ghId && this.generalJson) {
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