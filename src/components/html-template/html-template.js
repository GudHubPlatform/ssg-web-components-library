class HtmlTemplate extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        this.config = window.getConfig();
        
        let chapter = await window.getCurrentChapter();
        let ids = await super.findIds(chapter);

        const items = await gudhub.getItems(ids.appId);
        const item = items.find(item => item.item_id == ids.itemId);
        let customHtml;
        try {
            customHtml = await fetch(`https://gudhub.com/userdata/${ids.appId}/${item.fields.find(field => field.field_id == this.config.chapters[chapter].html_template_field_id).field_value}.html?t=${new Date().getTime()}`);
            customHtml = await customHtml.text();
        } catch (error) {
            console.log(error)
            customHtml = false;
        }
        if (customHtml) {
            let wrapperTag = document.createElement('div');
            wrapperTag.classList.add('custom-html-template');
            wrapperTag.innerHTML = customHtml;
            document.querySelector('body').prepend(wrapperTag);
        }

        this.remove();
    }
}

window.customElements.define('html-template', HtmlTemplate);
