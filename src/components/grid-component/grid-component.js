import html from './grid-component.html';
import './grid-component.scss';
import jsonTemplate from './grid-component-data.json';

class GridComponent extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        this.items = this.json.items;

        if (this.ghId) {
            super.render(html);
        }
    }

    onClientReady() {
        const clickableGridItems = this.getElementsByClassName('grid_item clickable');
        for (const el of clickableGridItems) {
            el.addEventListener('mouseup', (e) => {
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