import html from './list-text-and-media.html';
import './list-text-and-media.scss';
import jsonTemplate from './list-text-and-media-data.json';
class ListMediaAndText extends GHComponent {
    
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        this.json = await super.getGhData(this.ghId);

        this.items = this.json.items;

        super.render(html);
    }

    onClientReady() {
        const clickableItems = this.getElementsByClassName('list_item clickable');
        for (const el of clickableItems) {
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

window.customElements.define('list-text-and-media', ListMediaAndText);