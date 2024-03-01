import html from './accordion-only.html';
import './accordion-only.scss';
import jsonTemplate from './accordion-only-data.json';

class AccordionOnly extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.openedElement;
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        if (this.ghId) {
            super.render(html);
        }
    }

    onClientReady() {
        
    }

    toggleExpand(element) {
        const isOpening = element.classList.toggle('expand');
        const toggleOverflow = (element, bool) => {
            const action = bool ? 'add' : 'remove';
            element.classList[action]('overflow')
        };
        if (isOpening) {
            setTimeout(() => toggleOverflow(element, true), 0);
            if (this.openedElement && this.openedElement !== element) {
                this.openedElement.classList.remove('expand');
                toggleOverflow(this.openedElement, false);
            }
            this.openedElement = element;
        } else {
            toggleOverflow(element, false);
        }
    }
}

window.customElements.define('accordion-only', AccordionOnly);