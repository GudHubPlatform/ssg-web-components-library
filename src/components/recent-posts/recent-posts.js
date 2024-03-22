import html from './recent-posts.html';
import { generateArticlesAndCommentsObject } from '../../generate-articles-and-comments-object.js';
import { generateAuthorObject } from './author-object.js';
import './recent-posts.scss';

class RecentPosts extends GHComponent {
    constructor() {
        super();
    }
    
    async onServerRender() {
        let articlesAndComments = await gudhub.jsonConstructor(await generateArticlesAndCommentsObject(undefined, undefined, window.getConfig().chapters.blog));
        let articles = articlesAndComments.articlesAndComments.articles;
        let comments = articlesAndComments.articlesAndComments.comments;
        let categories = articlesAndComments.articlesAndComments.categories;

        const authors = await gudhub.jsonConstructor(generateAuthorObject(window.getConfig().chapters.blog));
        this.authors = authors.authors;

        this.articles = articles.slice(0, 2);
        for (let article in this.articles) {
            let commentsQuantity = 0;
            for (let comment in comments) {
                if (comments[comment].article_id == this.articles[article].id) {
                    commentsQuantity++;
                }
            }
            this.articles[article].commentsQuantity = commentsQuantity;
        }

        for (let article = 0; article < this.articles.length; article++) {
            // CATEGORIES
            this.articles[article].rating.avg = Number(this.articles[article].rating.avg.toFixed(1));
            const post = this.articles[article];
            post.category = [];
            
            for (let category in post.categories) {
                let categoryName = this.articles[article].categories[category].fields.find(field => field.field_id == window.getConfig().chapters.blog.heading_field_id).field_value;
                let categorySlug = this.articles[article].categories[category].fields.find(field => field.field_id == window.getConfig().chapters.blog.slug_field_id).field_value;
                let categoryObject = {
                    "name": categoryName,
                    "slug": categorySlug
                }
                post.category.push(categoryObject)
            }
            this.articles[article].categories = post.category;
            delete this.articles[article].category;

            // AUTHORS
            let authorSlug = this.authors.find(author => {
                if (author.author_id == this.articles[article].author_id) {
                    return author
                }
            });
            this.articles[article].author_slug = authorSlug.slug
        }

        // INTRO
        const promises = [];
        this.articles.forEach((article, index) => {
            promises.push(new Promise(async (resolve) => {
                let content = await gudhub.getInterpretationById(window.getConfig().chapters.blog.app_id, article.id.split('.')[1], window.getConfig().chapters.blog.intro_field_id, 'html');
                this.articles[index].intro = content;
                resolve();
            }));
        });

        await new Promise(resolve => {
            Promise.all(promises).then(() => {
                resolve();
            })
        });

        super.render(html);
    }

    onClientReady() {
        this.attachEventListener();
    }

    attachEventListener() {
        const clickableItems = this.querySelectorAll('.post');
        for (const el of clickableItems) {
            el.addEventListener('mouseup', (e) => {
            if ("a" !== e.target.tagName.toLowerCase()) {
                e.preventDefault();
                const item = e.currentTarget.querySelector("a.post_title");
                const link = item.getAttribute("href");
                if (link) {
                    if (e.button === 0) {
                        window.location.href = link;
                    } else if (e.button === 1) {
                        window.open(link, '_blank');
                    }
                }
            }});
        }
    }

    openArticle(post) {
        if (event.target.tagName != 'A' ) {
            let href = post.querySelector('.post_left a').href;
            window.location.href = href;
        }
    }
}

window.customElements.define('recent-posts', RecentPosts);