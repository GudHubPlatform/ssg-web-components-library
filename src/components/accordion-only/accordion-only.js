import html from './accordion-only.html';
import './accordion-only.scss';
import jsonTemplate from './accordion-only-data.json';

class AccordionOnly extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.openedElement = null;
    }
    
    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        const getCurrentChapter = await window?.getCurrentChapter();
        this.chapter = getCurrentChapter ? getCurrentChapter : 'pages';

        this.json = await super.getGhData(this.ghId, this.chapter);

        if (this.ghId) {
            await super.render(html);
        }
    }
    
    onClientReady() {
        this.attachEventListeners();
    }
    
    getBindedCallback(element) {
        const expandableFunction = (event) => {
            event.preventDefault();

            const checkIsTargetInteractive = (target) => {
                const preventedTagsForInteractive = ['button', 'a'];
                const checkInteractiveTagNames = (target) => preventedTagsForInteractive.includes(target.tagName.toLowerCase());
                const checkClassNames = (target) => target.classList.contains('btn');
    
                const checkers = [checkInteractiveTagNames, checkClassNames];
                const result = checkers.some((checker) => checker(target));
    
                return result;
            }
    
            if (checkIsTargetInteractive(event.target)) {
                return;
            }
    
            const isOpening = element.classList.toggle('expand');

            const toggleOverflow = (element, bool) => {
                const action = bool ? 'add' : 'remove';
                element.classList[action]('overflow');
            };
            if (isOpening) {
                if (this.openedElement && this.openedElement !== element) {
                    this.openedElement.classList.remove('expand');
                    toggleOverflow(this.openedElement, false);
                }
    
                this.openedElement = element;
    
                setTimeout(() => toggleOverflow(element, true), 0);
            } else {
                toggleOverflow(element, false);
                if (this.openedElement === element) {
                    this.openedElement = null;
                }
            }
        }
    
        return expandableFunction;
    }
    
    attachEventListeners() {
        const items = this.querySelectorAll('.primary-block');
        for (const item of items) {
            const boundCallback = this.getBindedCallback(item);
            item.addEventListener('click', boundCallback);
        }
    }
}

window.customElements.define('accordion-only', AccordionOnly);