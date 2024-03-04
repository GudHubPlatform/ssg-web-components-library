import html from './grid-item-expandable-vertical.html';
import './grid-item-expandable-vertical.scss';
import jsonTemplate from './grid-item-expandable-vertical-data.json';

class GridItemExpandableVertical extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        if (this.ghId) {
            super.render(html);
        }
    }

    onClientReady() {
        this.parentGrid = this.parentElement.parentElement;
        this.isOpened = false;
        this.expandableWrapper = this.querySelector(`.expandable-wrapper`);

        if (!this.isEnoughBottomSpace()) {
            this.expandableWrapper.classList.add('expand-to-top');
        }

        this.appendEventListeners();
    }

    dispatchOpenEvent() {
        const event = new CustomEvent(
            'grid-item-event',
            {
                detail: {
                    action: 'expand-item',
                    element: this
                }
            }
        );
        this.parentGrid.dispatchEvent(event);
    }

    appendEventListeners() {
        this.parentGrid.addEventListener('grid-item-event', this.handleItemExpandEvent);
    }

    handleItemExpandEvent = (event) => {
        const { detail } = event;
        const { action, element } = detail;

        switch (action) {
            case 'expand-item':
                if (element !== this && this.isOpened) {
                    this.toggleExpand();
                }
                break;
            default:
                break;
        }
    };

    handleClick() {
        this.toggleExpand();
    }

    toggleClasses(isOpened) {
        const action = isOpened ? 'remove' : 'add';

        this.expandableWrapper.classList[action]('expand');

        if (action === 'add') {
            setTimeout(() => {
                this.expandableWrapper.classList[action]('overflow');
            }, 200);
        } else {
            this.expandableWrapper.classList[action]('overflow');
        }
    }

    toggleExpand() {
        this.toggleClasses(this.isOpened);

        if (this.isOpened) {
            this.isOpened = false;
        } else {
            this.isOpened = true;
            this.dispatchOpenEvent();
        }
    }

    isEnoughBottomSpace() {
        if (!this.parentGrid) {
            console.error('grid container isn`t found');
            return false;
        }
        const gridBottom = this.parentGrid.getBoundingClientRect().bottom;
        const { top: thisTop, height: thisHeight } = this.getBoundingClientRect();
        const thisExpandHeight = thisHeight * 2.1;

        return gridBottom >= thisTop + thisExpandHeight;
    }
}

window.customElements.define('grid-item-expandable-vertical', GridItemExpandableVertical);