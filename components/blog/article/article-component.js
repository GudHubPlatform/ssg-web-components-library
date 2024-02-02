import html from './article-component.html';
import './article-component.scss';
import authorsObject from './authors-object.json';
import allArticles from './allArticles.json';

import { generateArticlesAndCommentsObject } from '../../../generate-articles-and-comments-object.js';

import generalInfo from '../../../../../general-info.json';

class ArticleComponent extends GHComponent {

    constructor() {
        super();
        this.rated = false;
    }

    async onServerRender() {
        const url = new URL(window.location.href);
        const articleSlug = url.searchParams.get('path');

        let articleAndComments = await gudhub.jsonConstructor(await generateArticlesAndCommentsObject('slug', articleSlug));

        let comments = articleAndComments.articlesAndComments.comments;
        this.article = articleAndComments.articlesAndComments.articles[0];
        console.log(this.article)

        const ogSiteImage = document.createElement('meta');
        ogSiteImage.setAttribute('property', 'og:image');
        ogSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.article.thumbnail_src}`);
        document.querySelector('head').prepend(ogSiteImage);

        const twitterSiteImage = document.createElement('meta');
        twitterSiteImage.setAttribute('name', 'twitter:image');
        twitterSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.article.thumbnail_src}`);
        document.querySelector('head').prepend(twitterSiteImage);
        
        let commentsQuantity = 0;
        for (let comment in comments) {
            if (comments[comment].article_id == this.article.id) {
                commentsQuantity++;
            }
        }
        this.article.commentsQuantity = commentsQuantity;

        this.articleReference = this.article.id;

        const authors = await gudhub.jsonConstructor(authorsObject);
        this.authors = authors.authors;


        // CATEGORIES
        this.article.rating.avg = Number(this.article.rating.avg.toFixed(1))
        const post = this.article;
        post.category = [];

        // Now in post.categories is only appId.itemId, so we need to add in post's object property with array of category's names and slugs

        for (let category in post.categories) {
            let categoryName = post.categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.heading_field_id).field_value;
            let categorySlug = post.categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.slug_field_id).field_value;
            let categoryObject = {
                "name": categoryName,
                "slug": categorySlug
            }
            post.category.push(categoryObject)
        }
        this.article.categories = post.category;
        
        delete this.article.category;

        this.breadcrumbs = JSON.stringify([
            {
                "title": "Blog",
                "slug": "/blog/"
            },
            {
                "title": this.article.categories[0].name,
                "slug": this.article.categories[0].slug
            },
            {
                "title": this.article.h1
            }
        ]);
        // AUTHORS
        this.author = this.authors.find(author => {
            if (author.author_id == this.article.author_id) {
                return author
            }
        });
        this.article.author_slug = this.author.slug
        this.article.author_linkedin = this.author.linkedin
        this.article.author_facebook = this.author.facebook

        const articleId = this.article.id.split('.')[1];
        const authorId = this.author.author_id.split('.')[1];
        this.author.description = await gudhub.getInterpretationById(window.constants.chapters.blog.app_id, authorId, window.constants.chapters.blog.intro_field_id, 'html');
        this.content = await gudhub.getInterpretationById(window.constants.chapters.blog.app_id, articleId, window.constants.chapters.blog.content_field_id, 'html');
        console.log(this.content);
        const getContent = (link) => {
            return new Promise(async (resolve) => {
                const response = await fetch(link);
                const content = await response.text();
                const div = document.createElement('div');
                div.insertAdjacentHTML('beforeend', content);
                resolve(div.innerText);
            });
        }
        
        this.author.position = await getContent(this.author.position);
        console.log(this.article.content)

        // SIDEBAR
        let content = JSON.parse(this.article.content);
        this.headings = [];
        for (let block in content.blocks) {
            if (content.blocks[block].type === 'header') {
                this.headings.push(content.blocks[block].data)
            }
        }

        this.articles = await gudhub.jsonConstructor(allArticles);

        for (let article = 0; article < this.articles.all_articles.length; article++) {
            if (this.article.slug == this.articles.all_articles[article].slug) {
                this.articles.all_articles.splice(article, 1)
            }
        }

        this.articles = this.articles.all_articles.slice(0, 3);

        for (let article in this.articles) {
            let postrCategories = [];
            for (let category in this.articles[article].categories) {
                let categoryName = this.articles[article].categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.heading_field_id).field_value;
                let categorySlug = this.articles[article].categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.slug_field_id).field_value;
                let categoryObject = {
                    "name": categoryName,
                    "slug": categorySlug
                }
                postrCategories.push(categoryObject)
            }
            this.articles[article].categories = postrCategories;
        }

        super.render(html);
        // Search img tags in content of article and replace it to image-component
        const images = this.querySelector('.content').querySelectorAll('img:not(img.gif)');

            images.forEach(image => {
                let src = image.getAttribute('src');
                if (src.substring(src.lastIndexOf('.'), src.length) != '.gif') {
                
                const imageComponent = document.createElement('image-component');
                try {
                    if(image.hasAttribute('data-url')) {
                        imageComponent.setAttribute('data-src', image.getAttribute('data-url').replace(/&quot/, '"'));
                        imageComponent.setAttribute('data-url', image.getAttribute('src').replace(/&quot/, '"'));
                    } else {
                        imageComponent.setAttribute('src', image.getAttribute('src').replace(/&quot/, '"'));
                    }
                    imageComponent.setAttribute('alt', image.getAttribute('alt'));
                    imageComponent.setAttribute('title', image.getAttribute('title'));
                    imageComponent.setAttribute('lazyload', true);
                    imageComponent.setAttribute('width', '830');
                    imageComponent.setAttribute('height', '300');
                    image.replaceWith(imageComponent);
                } catch(err) {
                    console.log(image);
                    console.log(err);
                }
            }
        });

        // Prepare headings for contents
        const h2 = this.querySelector('.content').querySelectorAll('h2');

        h2.forEach(title => {
            title.id = title.innerText.toLowerCase().replace(/[^\w\s]/g, '-').replace(/ /g, '-').replace(/-$/, '').replace(/^-/, '');
        });

        const h3 = this.querySelector('.content').querySelectorAll('h3');

        h3.forEach(title => {
            title.id = title.innerText.toLowerCase().replace(/[^\w\s]/g, '-').replace(/ /g, '-').replace(/-$/, '').replace(/^-/, '');
        });

        // SCHEMAS
        if(!document.head.querySelector('#articleSchema')) {
            const schemaForAuthors = [
                {
                    "@type": "Person",
                    "name": this.article.author,
                    "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.article.author_slug}`
                }
            ];

            const schema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.article.slug}`
                },
                "headline": this.article.h1,
                "image": [
                    `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + this.article.thumbnail_src
                ],
                "datePublished": new Date(Number(this.article.posted_at)),
                "dateModified": new Date(this.article.updated_at ? +this.article.updated_at : Number(this.article.posted_at)),
                "author": schemaForAuthors
            }
            
            document.head.innerHTML += `
                    <script id="articleSchema" type="application/ld+json">${JSON.stringify(schema)}</script>
                `;

            }

        if(!document.head.querySelector('#productSchema')) {
          
          const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": this.article.title,
            "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + this.article.slug,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": this.article.rating.avg.toFixed(1),
                "ratingCount": this.article.rating.count,
                "bestRating": 5,
                "worstRating": 1,
                "author": generalInfo.legalName,
                "item": this.article.h1
            }
        }
          
          document.head.innerHTML += `
                <script id="productSchema" type="application/ld+json">${JSON.stringify(schema)}</script>
            `;

        }
    }
    async onClientReady () {
        let rating = {};

        if ( localStorage.getItem('rating') != null ) {
            rating = JSON.parse(localStorage.getItem('rating'));
            let currentRating = 6 - rating[window.location.pathname];
            this.renderRating(currentRating);
        }
        fetch('https://gudhub.com/api/services/prod/api/33364/views', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slug: window.location.pathname
            })
        })
    }
    renderRating(grade) {
        let itemsList = this.querySelectorAll('.rate_us .rating > div');

        for (let iterationItem = 0; iterationItem < itemsList.length; iterationItem++) {
            itemsList[iterationItem].classList.remove('active')
            if (itemsList[iterationItem].getAttribute('data-grade') >= grade) {
                itemsList[iterationItem].classList.add('active')
            }
        }
    }

    updateRating(item) {
        
        if (!this.rated) {
            this.rated = true
            let rating = {};
    
            if ( localStorage.getItem('rating') != null ) {
                rating = JSON.parse(localStorage.getItem('rating'));
            }
    
            const grade = item.getAttribute('data-grade');
    
            this.renderRating(grade);
    
            const customerRating = 6 - grade;
            
            fetch('https://gudhub.com/api/services/prod/api/33364/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    slug: window.location.pathname,
                    rating: customerRating
                })
            })
            rating[window.location.pathname] = customerRating;
            localStorage.setItem('rating', JSON.stringify(rating));
        }
    }

    showPopup(item) {
        item.parentElement.classList.add('active');
    }
    hidePopup(item) {
        let shadow = this.querySelector('.background_shadow');
        if (event.target == shadow || item.classList.contains('close')) {
            this.querySelector('.meta_share .share').classList.remove('active');
        }
    }

    copy(item) {
        let copyText = item.querySelector(".link");
        let copyLink = item;

        let self = this;
        window.location.protocol === "https:" ? clipboardCopy(copyText, self) : clipboardCopy(copyText, self);
        function clipboardCopy(copyText, self) {
            navigator.clipboard
                .writeText(copyText.innerText)
                .then(() => {
                    item.querySelector('.copied') ? item.querySelector('.copied').classList.add('true') : '';
                })
                .catch(() => {
                    item.querySelector('.copied') ? item.querySelector('.copied').innerText = "Error!" : '';
                    item.querySelector('.copied') ? self.querySelector('.copied').classList.add('false') : '';
                });
        }
        copyLink.addEventListener("copy", function (event) {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", copyText.innerText);
                item.querySelector('.copied') ? item.querySelector('.copied').classList.add('true') : '';
            }
        });
    }
}

window.customElements.define('article-component', ArticleComponent);