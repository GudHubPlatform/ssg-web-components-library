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

        this.config = null;
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

        this.config = window.getConfig?.();
        if (!this.config) {
            console.warn('Config not available');
            return;
        }

        if (!appId && !itemId && path === ('/blog/')) { //blog/authors/
            appId = this.config.chapters.pages.app_id;
            itemId = this.config.chapters.pages.blog_main_page_item_id;

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

                    let slug = false;

                    // this code fix problem with blog pagination page ("/blog/page/${index}"), findIds was trying to search item with "slug", but as we know paginaton slug is computed (doesnt exist in gudhub)
                    if (chapter == 'pages' && path.includes("/blog/page/")) {
                        slug = "/blog/";
                    }
    
                    let ids = await super.findIds(currentChapter, slug);
                    await this.addTag(ids.appId, ids.itemId, slug, currentChapter);
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

        const chapterConfig = this.config?.chapters?.[chapter];
        if (!chapterConfig) {
            console.warn('Invalid chapter:', chapter);
            return;
        }

        const chapterItemId = item?.item_id;
        const fields = item?.fields ?? [];
        const generalInfo = this.config.componentsConfigs?.generalInfo?.[0];

        const {
            title_field_id: titleId,
            description_field_id: descriptionId,
            slug_field_id: slugId,
            image_field_id: imageId,
            meta_image_field_id: metaImageIdRaw,
            app_id: chapterAppId
        } = chapterConfig;

        const metaImageId = metaImageIdRaw || imageId;

        const getFieldValue = (fieldId) => {
            return fields.find(field => field.field_id === fieldId)?.field_value ?? null;
        };

        const isNumeric = (val) => {
            return typeof val === 'number' || 
                (typeof val === 'string' && val.trim() !== '' && !isNaN(val));
        };

        const resolveValue = async (value, fieldType) => {
            if (!isNumeric(value)) return value;

            if (fieldType === 'image') return value;

            try {
                return await this.getContent(
                    `https://app.gudhub.com/userdata/${chapterAppId}/${value}.html`
                );
            } catch (e) {
                console.error('Failed to load content:', value, e);
                return null;
            }
        };

        let titleValue = getFieldValue(titleId);
        let descriptionValue = getFieldValue(descriptionId);
        let slugValue = getFieldValue(slugId);
        let imageValue = getFieldValue(metaImageId);

        [titleValue, descriptionValue, slugValue, imageValue] = await Promise.all([
            resolveValue(titleValue, 'text'),
            resolveValue(descriptionValue, 'text'),
            resolveValue(slugValue, 'text'),
            resolveValue(imageValue, 'image'),
        ]);

        let imageUrl = imageValue;

        if (!metaImageIdRaw) {
            const itemFields = await gudhub.getItem(chapterAppId, chapterItemId);

            const currentFieldData = itemFields?.fields?.find(
                field => String(field?.field_id) === String(imageId)
            );

            if (currentFieldData?.field_value) {
                const imageData = await gudhub.getFile(
                    chapterAppId,
                    currentFieldData.field_value
                );

                imageUrl = imageData?.url || imageUrl;
            }
        }

        if (metaImageIdRaw && imageUrl) {
            const protocol = window.MODE === 'production' ? 'https' : 'http';
            const website = window.getConfig()?.website;
            imageUrl = `${protocol}://${website}${imageUrl}`
        }

        // TITLE
        if (!document.querySelector('title')) {
            const title = document.createElement('title');
            title.innerText = titleValue;
            document.querySelector('head').prepend(title);
        }

        if (!document.querySelector('[property="og:site_name"]')) {
            const metaSiteName = document.createElement('meta');
            metaSiteName.setAttribute('property', 'og:site_name');
            metaSiteName.setAttribute('content', generalInfo.name);
            document.querySelector('head').prepend(metaSiteName);
        }

        if (!document.querySelector('[name="twitter:card"]')) {
            const metaCard = document.createElement('meta');
            metaCard.setAttribute('name', 'twitter:card');
            metaCard.setAttribute('content', 'summary_large_image');
            document.querySelector('head').prepend(metaCard);
        }
        
        if (!document.querySelector('[name="twitter:site"]') && generalInfo.twitterName) {
            const metaSite = document.createElement('meta');
            metaSite.setAttribute('name', 'twitter:site');
            metaSite.setAttribute('content', generalInfo.twitterName);
            document.querySelector('head').prepend(metaSite);
        }

        if (!document.querySelector('[name="twitter:image"]')) {
            const twitterMetaSiteImage = document.createElement('meta');
            twitterMetaSiteImage.setAttribute('name', 'twitter:image');
            twitterMetaSiteImage.setAttribute('content', imageUrl);
            document.querySelector('head').prepend(twitterMetaSiteImage);
        }

        if (!document.querySelector('[property="og:image"]')) {
            const metaSiteImage = document.createElement('meta');
            metaSiteImage.setAttribute('property', 'og:image');
            metaSiteImage.setAttribute('content', imageUrl);
            document.querySelector('head').prepend(metaSiteImage);
        }

        if (!document.querySelector('[property="og:type"]')) {
            const metaWebsite = document.createElement('meta');
            metaWebsite.setAttribute('property', 'og:type');
            metaWebsite.setAttribute('content', 'website');
            document.querySelector('head').prepend(metaWebsite);
        }

        if (!document.querySelector('[property="og:locale"]')) {
            const metaLocale = document.createElement('meta');
            metaLocale.setAttribute('property', 'og:locale');
            metaLocale.setAttribute('content', document.documentElement.lang);
            document.querySelector('head').prepend(metaLocale);
        }

        if (!document.querySelector('[property="og:description"]')) {
            const metaDescription = document.createElement('meta');
            metaDescription.setAttribute('property', 'og:description');
            metaDescription.setAttribute('content', descriptionValue);
            document.querySelector('head').prepend(metaDescription);
        }

        if (!document.querySelector('[name="twitter:title"]')) {
            const metaTwitter = document.createElement('meta');
            metaTwitter.setAttribute('name', 'twitter:title');
            metaTwitter.setAttribute('content', titleValue);
            document.querySelector('head').prepend(metaTwitter);
        }

        if (!document.querySelector('[name="twitter:description"]')) {
            const metaTwitterDescription = document.createElement('meta');
            metaTwitterDescription.setAttribute('name', 'twitter:description');
            metaTwitterDescription.setAttribute('content', descriptionValue);
            document.querySelector('head').prepend(metaTwitterDescription);
        }

        if (!document.querySelector('[name="description"]')) {
            const metaSimpleDescription = document.createElement('meta');
            metaSimpleDescription.setAttribute('name', 'description');
            metaSimpleDescription.setAttribute('content', descriptionValue);
            document.querySelector('head').prepend(metaSimpleDescription);
        }

        if (this.og) {
            if (this.type != 'meta_image_src') {
        
            }
        } else if (this.twitter) {
            if (this.type != 'meta_image_src') {
                
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

        this.remove();
    }

    getContent(link) {
        return fetch(link)
            .then(res => res.text())
            .then(content => {
                const div = document.createElement('div');
                div.innerHTML = content;
                return div.innerText;
            })
            .catch(err => {
                console.error('getContent error:', err);
                return null;
            });
    }
}

window.customElements.define('meta-tag', MetaTag);
