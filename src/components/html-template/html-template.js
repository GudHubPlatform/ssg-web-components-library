class HtmlTemplate extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        this.config = window.getConfig();
        
        let chapter = await window.getCurrentChapter();
        let ids = await super.findIds(chapter);

        let customHtml;

        try {
            const fieldId = this.config.chapters[chapter].html_template_field_id;
            const fileId = await gudhub.getFieldValue(ids.appId, ids.itemId, fieldId);

            const fileInfo = await gudhub.getFile(ids.appId, fileId);
            customHtml = await fetch(fileInfo.url);
            customHtml = await customHtml.text();
        } catch (error) {
            console.log(error)
            customHtml = false;
        }
        if (customHtml) {
            const body = document.querySelector('body');
            body.innerHTML = customHtml;

            const links = body.querySelectorAll('link');
            this.attachLinks(links);
        }
    }

    attachLinks(links) {
        links.forEach(link => {
            document.head.appendChild(link);
        });
    }
}

window.customElements.define('html-template', HtmlTemplate);
