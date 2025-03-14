import html from './counter-section-with-text.html';
import './counter-section-with-text.scss';
import jsonTemplate from './counter-section-with-text-data.json';

class CounterSectionWithText extends GHComponent {

    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        const getCurrentChapter = await window?.getCurrentChapter();
        this.chapter = getCurrentChapter ? getCurrentChapter : 'pages';

        this.json = await super.getGhData(this.ghId, this.chapter);

        this.title = this.json.title;
        this.items = this.json.items;

        if (this.title) {
            this.titleTag = this.json.titleTag;
        }

        super.render(html);
    }

}

window.customElements.define('counter-section-with-text', CounterSectionWithText);