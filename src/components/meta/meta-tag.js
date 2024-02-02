import generalInfo from '/src/general-info.json';

class MetaTag extends GHComponent {
    /**
     * type = title / ddescription / meta_image_src - every value generate different meta tag
     * og - generate open graph meta tag with type you set
     * twitter - generate meta tag of twitter card with type you set
     * data-twitter-name - name of your twitter account (@Template)
     * data-chapter - chapter, default - pages
     * data-appId - app id of application with this page
     * data-itemId - item id of item with this page
     */
    constructor() {
        super();
    }
    
    async onServerRender() {
        this.type = this.getAttribute('type');
        this.og = this.hasAttribute('og') ? true : false;
        this.twitter = this.hasAttribute('twitter') ? true : false;
        this.twitterName = this.hasAttribute('data-twitter-name') ? this.getAttribute('data-twitter-name') : false;
        const appId = this.hasAttribute('data-appId') ? this.getAttribute('data-appId') : false;
        const itemId = this.hasAttribute('data-itemId') ? this.getAttribute('data-itemId') : false;
        const chapter = this.hasAttribute('data-chapter') ? this.getAttribute('data-chapter') : 'pages';

        if (appId && itemId) {
            this.addTag(appId, itemId, false, chapter);
        } else {
            if (chapter == 'blog' && !itemId) {
                const url = new URL(window.location.href);
                const category = url.searchParams.get('category');
                const path = url.searchParams.get('path');
                if (path.includes('/page/')) {
                    let slug = `/blog/${category}/`;
                    await this.addTag(appId, false, slug, chapter);
                } else {
                    let ids = await super.findIds(chapter);
                    await this.addTag(ids.appId, ids.itemId, false, chapter);
                }
            } else {
                let ids = await super.findIds(chapter);
                await this.addTag(ids.appId, ids.itemId, false, chapter);
            }
        }
    }
    async addTag (appId, itemId, slug, chapter) {
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

        fieldId = app.field_list.find(findedField => findedField.name_space === this.type);
        fieldId = fieldId.field_id;
        value = item.fields.find(findedField => findedField.field_id == fieldId).field_value;
        
        value = isNaN(value) ? value : await this.getContent(`https://gudhub.com/userdata/${window.constants.chapters[chapter].app_id}/${value}.html`);
        
        if (this.og) {
            if (this.type != 'meta_image_src') {
                const meta = document.createElement('meta');
                let type = this.type;
                const name = 'og:' + type;
                meta.setAttribute('property', name);
                meta.setAttribute('content', value);
                document.querySelector('head').prepend(meta);
            }
            if (this.type == 'title') {
                const metaSiteName = document.createElement('meta');
                const name = 'og:site_name';
                metaSiteName.setAttribute('property', name);
                metaSiteName.setAttribute('content', generalInfo.name);
                document.querySelector('head').prepend(metaSiteName);
            }
            if (this.type == 'meta_image_src') {
                const metaSiteImage = document.createElement('meta');
                const name = 'og:image';
                metaSiteImage.setAttribute('property', name);
                metaSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${value}`);
                document.querySelector('head').prepend(metaSiteImage);
            }
        } else if (this.twitter) {
            if (this.type != 'meta_image_src') {
                const meta = document.createElement('meta');
                let type = this.type;
                const name = 'twitter:' + type;
                meta.setAttribute('name', name);
                meta.setAttribute('content', value);
                document.querySelector('head').prepend(meta);
            }
            
            if (this.type == 'title') {
                const metaCard = document.createElement('meta');
                metaCard.setAttribute('name', 'twitter:card');
                metaCard.setAttribute('content', 'summary_large_image');
                
                document.querySelector('head').prepend(metaCard);
                
                const metaSite = document.createElement('meta');
                metaSite.setAttribute('name', 'twitter:site');
                metaSite.setAttribute('content', this.twitterName);
                
                document.querySelector('head').prepend(metaSite);
            }
            

            if (this.type == 'meta_image_src') {
                const metaSiteImage = document.createElement('meta');
                const name = 'twitter:image';
                metaSiteImage.setAttribute('name', name);
                metaSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${value}`);
                document.querySelector('head').prepend(metaSiteImage);
            }
        } else {
            const meta = document.createElement('meta');
            let name;
            if (this.type == "title") {
                name = "title"
            } else if (this.type == "meta_image_src") {
                name = "image"
            } else {
                name = this.type
            }
            meta.setAttribute('name', name);
            meta.setAttribute('content', value);
            document.querySelector('head').prepend(meta);
        }
        if (!document.querySelector('[property="og:type"]')) {
            const metaWebsite = document.createElement('meta');
            metaWebsite.setAttribute('property', 'og:type');
            metaWebsite.setAttribute('content', 'webiste');
            document.querySelector('head').prepend(metaWebsite);
        }
        
        if (!document.querySelector('[property="og:locale"]')) {
            const metaLocale = document.createElement('meta');
            metaLocale.setAttribute('property', 'og:locale');
            metaLocale.setAttribute('content', 'en');
            document.querySelector('head').prepend(metaLocale);
        }

        this.remove();
    }

    getContent(link) {
        return new Promise(async (resolve) => {
            const response = await fetch(link);
            const content = await response.text();
            const div = document.createElement('div');
            div.insertAdjacentHTML('beforeend', content);
            resolve(div.innerText);
        });
    }
}

window.customElements.define('meta-tag', MetaTag);