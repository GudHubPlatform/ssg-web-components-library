import html from './recent-posts.html';
import { generateArticlesAndCommentsObject } from '../../generate-articles-and-comments-object.js';
import authorObject from './author-object.json';
import './recent-posts.scss';

class RecentPosts extends GHComponent {
    constructor() {
        super();
    }
    
    async onServerRender() {
        let articlesAndComments = await gudhub.jsonConstructor(await generateArticlesAndCommentsObject());
        console.log('articlesAndComments',articlesAndComments)
        let articles = articlesAndComments.articlesAndComments.articles;
        console.log('articles',articles)
        let comments = articlesAndComments.articlesAndComments.comments;
        let categories = articlesAndComments.articlesAndComments.categories;

        const authors = await gudhub.jsonConstructor(authorObject);
        this.authors = authors.authors;

        this.articles = articles.slice(0, 3);
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
                let categoryName = this.articles[article].categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.heading_field_id).field_value;
                let categorySlug = this.articles[article].categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.slug_field_id).field_value;
                let categoryObject = {
                    "name": categoryName,
                    "slug": categorySlug
                }
                post.category.push(categoryObject)
            }
            this.articles[article].categories = post.category;
            delete this.articles[article].category;

            // AUTHORS
            console.log(this.authors)
            let authorSlug = this.authors.find(author => {
                if (author.author_id == this.articles[article].author_id) {
                    return author
                }
            });
            console.log(authorSlug)
            this.articles[article].author_slug = authorSlug.slug
        }

        // INTRO
        const promises = [];
        this.articles.forEach((article, index) => {
            promises.push(new Promise(async (resolve) => {
                let content = await gudhub.getInterpretationById(window.constants.chapters.blog.app_id, article.id.split('.')[1], article.intro_id, 'html');
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

    openArticle(post) {
        if (event.target.tagName != 'A' ) {
            let href = post.querySelector('.post_left a').href;
            window.location.href = href;
        }
    }
}

window.customElements.define('recent-posts', RecentPosts);