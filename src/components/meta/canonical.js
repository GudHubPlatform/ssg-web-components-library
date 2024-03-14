class CanonicalComponent extends GHComponent {
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

        const url = new URL(window.location.href);
        const path = url.searchParams.get('path');
        
        if (!appId && !itemId && path == '/blog/') {
            appId = window.getConfig().chapters.pages.app_id;
            itemId = window.getConfig().chapters.pages.blog_main_page_item_id;
        }

        if (appId && itemId) {
            this.findCanonical(appId, itemId, false);
        } else {
            const url = new URL(window.location.href);
            const author = url.searchParams.get('author');
            const category = url.searchParams.get('category');
            const article = url.searchParams.get('article');
            
            const chapter = document.querySelector('[data-chapter]') ? document.querySelector('[data-chapter]').getAttribute('data-chapter') : 'pages';
            if (chapter == 'blog' && !itemId) {
                const url = new URL(window.location.href);
                const category = url.searchParams.get('category');
                const path = url.searchParams.get('path');

                if (path.includes('/page/')) {
                    let slug = `/blog/${category}/`;
                    await this.findCanonical(appId, false, slug);
                } else {
                    let ids = await super.findIds(chapter);
                    await this.findCanonical(ids.appId, ids.itemId, false);
                }
            } else if (author != null) {
                let ids = await super.findIds('blog');
                await this.findCanonical(ids.appId, ids.itemId, `/blog/authors/${author}/`);
            } else if (article != null) {
                let ids = await super.findIds('blog');
                await this.findCanonical(ids.appId, ids.itemId, `/blog/${category}/${article}/`);
            } else {
                let ids = await super.findIds(chapter);
                await this.findCanonical(ids.appId, ids.itemId, false);
            }
        }

    }
    async findCanonical (appId, itemId, slug) {
        const app = await gudhub.getApp(appId);
        const items = app.items_list;
        let item;
        let fieldId;
        let value;
        if (!slug) {
            item = items.find(findedItem => findedItem.item_id == itemId);
        } else {
            for (let findedItem in items) {
                
                let iterationItem = items[findedItem].fields.find(field => field.field_value == slug)
                if (iterationItem) {
                    item = items[findedItem];
                }
            }
        }
        fieldId = app.field_list.find(findedField => findedField.name_space === 'slug').field_id;
        value = item.fields.find(findedField => findedField.field_id == fieldId).field_value;
        
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}${value}`);

        const ogUrl = document.createElement('meta');
        ogUrl.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}${value}`);
        ogUrl.setAttribute('property', 'og:url');

        document.querySelector('head').appendChild(link);
        document.querySelector('head').appendChild(ogUrl);
        this.remove();
    }
}

window.customElements.define('canonical-component', CanonicalComponent);