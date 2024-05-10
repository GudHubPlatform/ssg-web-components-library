import html from './grid-item-default.html';
import './grid-item-default.scss';
import svgPlaceholder from '../../../svgPlaceholder.js'

class GridItemDefault extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        this.itemIndex = this.getAttribute('data-item-index') || null;
        this.generalGhId = this.getAttribute('data-gh-id') || null;
        this.ghId = `${this.generalGhId}.items.${this.itemIndex}`;


        const getCurrentChapter = await window?.getCurrentChapter();
        this.chapter = getCurrentChapter ? getCurrentChapter : 'pages';

        this.generalJson = await super.getGhData(this.generalGhId, this.chapter);
        this.json = this.generalJson ? this.generalJson.items[this.itemIndex] : null;
        this.svgPlaceholder = svgPlaceholder;

        if (this.ghId && this.generalJson) {
            super.render(html);
        }
    }

    onClientReady() {
        const clickableGridItem = this.querySelector('.primary-block.clickable');
        clickableGridItem?.addEventListener('mouseup', (e) => {
            if ("a" !== e.target.tagName.toLowerCase()) {
                e.preventDefault();
                const item = e.currentTarget.querySelector(".item-title");
                const link = item.getAttribute("href");
                if (link) {
                    if (e.button === 0) {
                        window.location.href = link;
                    } else if (e.button === 1) {
                        window.open(link, '_blank');
                    }
                } else {
                    this.openPopup(e.currentTarget);
                }
            }
        });
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

window.customElements.define('grid-item-default', GridItemDefault);