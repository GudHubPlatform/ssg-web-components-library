import generalInfo from '/src/general-info.json';
import authorsObject from "./authors.json";
import articlesObject from "./articles.json";
class BlogSchema extends GHComponent {
    /*
     * data-chapter - chapter, default pages 
     */
    constructor() {
        super();
    }

    async onServerRender() {
        if (!window.location.href.includes('/page/')) {
            const chapter = this.hasAttribute('data-chapter') ? this.getAttribute('data-chapter') : 'pages';

            // Find appId and itemId, then find in item fields which we need
            let ids = await super.findIds(chapter);
            const app = await gudhub.getApp(ids.appId);
            const items = app.items_list;
            let item = items.find(findedItem => findedItem.item_id == ids.itemId);
            const blogName = item.fields.find(field => field.field_id == window.constants.chapters[chapter].heading_field_id).field_value;
            const blogDescription = item.fields.find(field => field.field_id == window.constants.chapters[chapter].description_field_id).field_value;
            // Get all articles and slice 10 articles to show in blog-schema
            let articles = await gudhub.jsonConstructor(articlesObject);
            articles = articles.articles.slice(0, 10);
            const blogImage = articles[0].thumbnail_url;
            let authors = await gudhub.jsonConstructor(authorsObject);
            authors = authors.authors;

            let posts = [];
            for (let article in articles) {
                let author = authors.find(author => author.id == articles[article].author_id);
                let authorObject = {
                    "@type": "Person",
                    "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${author.slug}`,
                    "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}{author.slug}`,
                    "name": author.name
                }
                let post = {
                    "@type": "BlogPosting",
                    "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${articles[article].slug}`,
                    "mainEntityOfPage": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${articles[article].slug}`,
                    "headline": articles[article].title,
                    "name": articles[article].title,
                    "description": articles[article].description,
                    "datePublished": new Date(Number(articles[article].posted_at)).toISOString(),
                    "dateModified": articles[article].updated_at ? new Date(Number(articles[article].updated_at)).toISOString() : new Date(Number(articles[article].posted_at)).toISOString(),
                    "author": authorObject,
                    "image": {
                        "@type": "ImageObject",
                        "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}{articles[article].thumbnail_url}`,
                        "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}{articles[article].thumbnail_url}`,
                        "height": "410",
                        "width": "950"
                    },
                    "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}{articles[article].slug}`
                };
                posts.push(post);
            }
            
            const schema = {
                "@context": "https://schema.org/",
                "@type": "Blog",
                "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}/blog/`,
                "mainEntityOfPage": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}/blog/`,
                "name": blogName,
                "description": blogDescription,
                "publisher": {
                    "@type": "Organization",
                    "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}`,
                    "name": generalInfo.name,
                    "logo": {
                        "@type": "ImageObject",
                        "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + blogImage,
                        "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + blogImage,
                        "width": "1920",
                        "height": "700"
                    }
                },
                "blogPost": posts
            };
            if (!document.head.querySelector('#blogSchema')) {
                document.head.innerHTML += `
                    <script id="blogSchema" type="application/ld+json">${JSON.stringify(schema)}</script>
                `;

            }
        }
        this.remove();
    }
}

window.customElements.define('blog-schema', BlogSchema);