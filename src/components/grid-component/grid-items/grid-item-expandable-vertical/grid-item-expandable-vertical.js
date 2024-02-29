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
        
    }

    toggleExpand() {
        const wrap = this.querySelector(`.absolute-wrap`);
        if (wrap) {
            if (!this.isEnoughBottomSpace()) {
                wrap.classList.add('expand-to-top');
            }
            const isOpening = wrap.classList.toggle('expand');
            const toggleOverflow = () => wrap.classList.toggle('overflow');
            if (isOpening) {
                setTimeout(toggleOverflow, 200);
            } else {
                toggleOverflow();
            }
        }
    }

    isEnoughBottomSpace() {
        const grid = this.parentElement.parentElement;
        if (grid && !grid.classList.contains('grid')) {
            console.error('grid container isn`t found');
            return false;
        }
        const gridBottom = grid.getBoundingClientRect().bottom;
        const { top: thisTop, height: thisHeight } = this.getBoundingClientRect();
        const thisExpandHeight = thisHeight * 2.1;

        return gridBottom >= thisTop + thisExpandHeight;
    }
}

window.customElements.define('grid-item-expandable-vertical', GridItemExpandableVertical);