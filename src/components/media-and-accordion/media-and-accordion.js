import html from './media-and-accordion.html';
import './media-and-accordion.scss';
import jsonTemplate from './media-and-accordion-data.json';

class MediaAndAccordion extends GHComponent {
    
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        this.json = await super.getGhData(this.ghId);

        this.subtitle = this.json.subtitle;
        this.items = this.json.items;

        super.render(html);
    }

    onClientReady() {
        let items = this.querySelectorAll('.right .item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                item.classList.add('active')
            })
        });
    }

    openItem(item) {
        let items = this.querySelectorAll('.item');
        let itemTarget = item;
        if (window.innerWidth < 800) {
            if (itemTarget.classList.contains('active')) {
                itemTarget.classList.remove('active');
            } else {
                this.toggleClasses(items, itemTarget);
            }
        } else {
            this.toggleClasses(items, itemTarget);
        }
    }

    toggleClasses(items, itemTarget) {
        items.forEach(element => {
            element.classList.remove('active');
        });
        itemTarget.classList.add('active');
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

window.customElements.define('media-and-accordion', MediaAndAccordion);