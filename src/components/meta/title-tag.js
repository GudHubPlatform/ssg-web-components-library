class TitleTag extends GHComponent {
    /**
     *  data-chapter - chapter, default - pages
     *  data-appId - app id of application with this page
     *  data-itemId - item id of item with this page
     */
    constructor() {
        super();
    }

    async onServerRender() {
        let appId = this.hasAttribute('data-appId') ? this.getAttribute('data-appId') : false;
        let itemId = this.hasAttribute('data-itemId') ? this.getAttribute('data-itemId') : false;

        // "file:///home/dima/Work/ssg-ssr-websites/192.168.14.224:3333/dist/blog/blog.html?routeObject={%22route%22:%22/blog/page/:page/%22,%22index%22:%22/blog/blog.html%22}&page=2&path=/blog/page/2/"
        const url = new URL(window.location.href);
        const path = url.searchParams.get('path');

        if (!appId && !itemId && path.includes('/blog/')) {
            appId = window.constants.chapters.pages.app_id;
            itemId = window.constants.chapters.pages.blog_main_page_item_id;
        }

        if (appId && itemId) {
            this.findTitle(appId, itemId, false);
        } else {
            const chapter = this.hasAttribute('data-chapter') ? this.getAttribute('data-chapter') : 'pages';
            if (chapter == 'blog' && !itemId) {
                const url = new URL(window.location.href);
                const category = url.searchParams.get('category');
                const path = url.searchParams.get('path');
                if (path.includes('/page/')) {
                    let slug = `/blog/${category}/`;
                    await this.findTitle(appId, false, slug);
                } else {
                    let ids = await super.findIds(chapter);
                    await this.findTitle(ids.appId, ids.itemId, false);
                }
            } else {
                let ids = await super.findIds(chapter);
                await this.findTitle(ids.appId, ids.itemId, false);
            }
        }
    }
    async findTitle (appId, itemId, slug) {
        const app = await gudhub.getApp(appId);
        const items = app.items_list;

        let item;
        let fieldId;
        let value;
        if (!slug) {
            item = items.find(findedItem => findedItem.item_id == itemId);
        } else {
            items.forEach(findedItem => {
                let iterationItem = findedItem.fields.find(field => field.field_value == slug)
                if (iterationItem) {
                    item = findedItem;
                }
            });
        }
        fieldId = app.field_list.find(findedField => findedField.name_space === 'title').field_id;
        value = item.fields.find(findedField => findedField.field_id == fieldId).field_value;
        
        
        const title = document.createElement('title');
        title.innerText = value;
        
        document.querySelector('head').appendChild(title);
        this.remove();
    }
}

window.customElements.define('title-tag', TitleTag);