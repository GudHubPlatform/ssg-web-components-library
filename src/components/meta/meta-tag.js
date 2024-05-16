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
        let appId = this.hasAttribute('data-appId') ? this.getAttribute('data-appId') : false;
        let itemId = this.hasAttribute('data-itemId') ? this.getAttribute('data-itemId') : false;
        let chapter = document.querySelector('[data-chapter]') ? document.querySelector('[data-chapter]').getAttribute('data-chapter') : 'pages';

        const url = new URL(window.location.href);
        const path = url.searchParams.get('path');

        if (!appId && !itemId && path === ('/blog/')) { //blog/authors/
            appId = window.getConfig().chapters.pages.app_id;
            itemId = window.getConfig().chapters.pages.blog_main_page_item_id;
            this.addTag(appId, itemId, false, chapter);
        } else {
            const url = new URL(window.location.href);
            const author = url.searchParams.get('author');
            const category = url.searchParams.get('category');
            const article = url.searchParams.get('article');
            if (appId && itemId) {
                this.addTag(appId, itemId, false, chapter);
            } else {
                if (chapter == 'blog' && !itemId) {
                    const url = new URL(window.location.href);
                    const path = url.searchParams.get('path');
                    if (path.includes('/page/')) {
                        let slug = `/blog/${category}/`;
                        await this.addTag(appId, false, slug, chapter);
                    } else {
                        let ids = await super.findIds(chapter);
                        await this.addTag(ids.appId, ids.itemId, false, chapter);
                    }
                } else if (author != null) {
                    let ids = await super.findIds('blog');
                    await this.addTag(ids.appId, ids.itemId, `/blog/authors/${author}/`, 'blog');
                } else if (article != null) {
                    let ids = await super.findIds('blog');
                    await this.addTag(ids.appId, ids.itemId, `/blog/${category}/${article}/`, 'blog');
                } else {
                    const getCurrentChapter = await window?.getCurrentChapter();
                    const currentChapter = getCurrentChapter ? getCurrentChapter : 'pages';

                    let ids = await super.findIds(currentChapter);
                    await this.addTag(ids.appId, ids.itemId, false, currentChapter);
                }
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

        // fieldId = app.field_list.find(findedField => findedField.name_space === this.type);
        const generalInfo = window.getConfig().componentsConfigs.generalInfo[0];
        let titleId = window.getConfig().chapters[chapter].title_field_id;
        let descriptionId = window.getConfig().chapters[chapter].description_field_id;
        let slugId = window.getConfig().chapters[chapter].slug_field_id;
        let imageId = window.getConfig().chapters[chapter].image_field_id;
        // fieldId = fieldId.field_id;
        // value = item.fields.find(findedField => findedField.field_id == fieldId).field_value;


        let titleValue = item.fields.find(findedField => findedField.field_id == titleId).field_value;
        let descriptionValue = item.fields.find(findedField => findedField.field_id == descriptionId).field_value;
        let slugValue = item.fields.find(findedField => findedField.field_id == slugId).field_value;
        let imageValue = !slugValue.includes('/blog/') ? item.fields.find(findedField => findedField.field_id == imageId).field_value : false;

        // value = isNaN(value) ? value : await this.getContent(`https://gudhub.com/userdata/${window.getConfig().chapters[chapter].app_id}/${value}.html`);
        titleValue = isNaN(titleValue) ? titleValue : await this.getContent(`https://gudhub.com/userdata/${window.getConfig().chapters[chapter].app_id}/${titleValue}.html`);
        descriptionValue = isNaN(descriptionValue) ? descriptionValue : await this.getContent(`https://gudhub.com/userdata/${window.getConfig().chapters[chapter].app_id}/${descriptionValue}.html`);
        slugValue = isNaN(slugValue) ? slugValue : await this.getContent(`https://gudhub.com/userdata/${window.getConfig().chapters[chapter].app_id}/${slugValue}.html`);
        imageValue = !slugValue.includes('/blog/') ? isNaN(imageValue) ? imageValue : await this.getContent(`https://gudhub.com/userdata/${window.getConfig() .chapters[chapter].app_id}/${imageValue}.html`) : false;

        
        //TITLE
        if ( !document.querySelector('title') ) {
            const title = document.createElement('title');
            title.innerText = titleValue;
            document.querySelector('head').prepend(title);
        }

        if ( !document.querySelector('[property="og:site_name"]') ) {
            const metaSiteName = document.createElement('meta');
            metaSiteName.setAttribute('property', 'og:site_name');
            metaSiteName.setAttribute('content', generalInfo.name);
            document.querySelector('head').prepend(metaSiteName);
        }


        if ( !document.querySelector('[name="twitter:card"]') ) {
            const metaCard = document.createElement('meta');
            metaCard.setAttribute('name', 'twitter:card');
            metaCard.setAttribute('content', 'summary_large_image');
            document.querySelector('head').prepend(metaCard);
        }
        
        if ( !document.querySelector('[name="twitter:site"]') && generalInfo.twitterName ) {
            const metaSite = document.createElement('meta');
            metaSite.setAttribute('name', 'twitter:site');
            metaSite.setAttribute('content', generalInfo.twitterName);
            document.querySelector('head').prepend(metaSite);
        }
        

        if (!slugValue.includes('/blog/')) {
            if ( !document.querySelector('[name="twitter:image"]') ) {
                const twitterMetaSiteImage = document.createElement('meta');
                twitterMetaSiteImage.setAttribute('name', 'twitter:image');
                twitterMetaSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}${imageValue}`);
                document.querySelector('head').prepend(twitterMetaSiteImage);
            }

            if ( !document.querySelector('[property="og:image"]') ) {
                const metaSiteImage = document.createElement('meta');
                metaSiteImage.setAttribute('property', 'og:image');
                metaSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}${imageValue}`);
                document.querySelector('head').prepend(metaSiteImage);
            }
        }

        if ( !document.querySelector('[property="og:type"]') ) {
            const metaWebsite = document.createElement('meta');
            metaWebsite.setAttribute('property', 'og:type');
            metaWebsite.setAttribute('content', 'website');
            document.querySelector('head').prepend(metaWebsite);
        }

        if ( !document.querySelector('[property="og:locale"]') ) {
            const metaLocale = document.createElement('meta');
            metaLocale.setAttribute('property', 'og:locale');
            metaLocale.setAttribute('content', document.documentElement.lang);
            document.querySelector('head').prepend(metaLocale);
        }

        if ( !document.querySelector('[property="og:title"]') ) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:title');
            meta.setAttribute('content', titleValue);
            document.querySelector('head').prepend(meta);
        }

        if ( !document.querySelector('[property="og:description"]') ) {
            const metaDescription = document.createElement('meta');
            metaDescription.setAttribute('property', 'og:description');
            metaDescription.setAttribute('content', descriptionValue);
            document.querySelector('head').prepend(metaDescription);
        }

        if ( !document.querySelector('[name="twitter:title"]') ) {
            const metaTwitter = document.createElement('meta');
            metaTwitter.setAttribute('name', 'twitter:title');
            metaTwitter.setAttribute('content', titleValue);
            document.querySelector('head').prepend(metaTwitter);
        }

        if ( !document.querySelector('[name="twitter:description"]') ) {
            const metaTwitterDescription = document.createElement('meta');
            metaTwitterDescription.setAttribute('name', 'twitter:description');
            metaTwitterDescription.setAttribute('content', descriptionValue);
            document.querySelector('head').prepend(metaTwitterDescription);
        }

        if ( !document.querySelector('[name="description"]') ) {
            const metaSimpleDescription = document.createElement('meta');
            metaSimpleDescription.setAttribute('name', 'description');
            metaSimpleDescription.setAttribute('content', descriptionValue);
            document.querySelector('head').prepend(metaSimpleDescription);
        }

        // if (this.og) {
        //     if (this.type != 'meta_image_src') {
        
        //     }
        // } else if (this.twitter) {
        //     if (this.type != 'meta_image_src') {
        //         
        //     }
           
        // } else {
        //     const meta = document.createElement('meta');
        //     let name;
        //     if (this.type == "title") {
        //         name = "title"
        //     } else if (this.type == "meta_image_src") {
        //         name = "image"
        //     } else {
        //         name = this.type
        //     }
        //     meta.setAttribute('name', name);
        //     meta.setAttribute('content', value);
        //     document.querySelector('head').prepend(meta);
        // }

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