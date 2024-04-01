import html from './posts-template.html';
import './posts-template.scss';

import generateCategoriesScheme from './categories-scheme.js';
import generateAuthorsObjectScheme from './authors-object-scheme.js';

import { generateSlugFilterByLanguage } from '../schemeFilters.js';

import { generateArticlesAndCommentsObject } from '../../../generate-articles-and-comments-object.js';

import {initBlogConfig} from '../initBlogConfig.js';

class PostsTemplate extends GHComponent {
    /*
    * data-type = blog/author/category. default - blog.
    * data-type = "author" - on author page
    * data-type = "category" - on category page
    * 
    * 
    * data-main-post - set this attribute if you need big first post
    */

    constructor() {
        super();
        this.allArticles;
        this.fetchingNow = false;
        this.firstLoad = true;
        this.currentCategory; 
        this.type = this.hasAttribute('data-type') ? this.getAttribute('data-type') : 'blog';
        this.start = 0;
        this.postsPerPage = 10;
        this.index = 0;

        this.config;
        
        this.headingFieldId = this.environment === 'server' ? window.getConfig().chapters.blog.heading_field_id : false;
        this.slugFieldId = this.environment === 'server' ? window.getConfig().chapters.blog.slug_field_id : false;
    }
    
    async onServerRender() {

        this.config = initBlogConfig(window.getConfig().componentsConfigs.blog_config[0]);

        this.configCategories = JSON.stringify(this.config);

        this.mainPost = this.hasAttribute('data-main-post');

        let articlesAndComments;
        let articles;

        const clientConfig = window.getConfig();
        const { slug_field_id } = clientConfig.chapters.blog;

        const filters = [];

        if (clientConfig.multiLanguage) {
            const langFilter = generateSlugFilterByLanguage(slug_field_id);
            filters.push(langFilter);
        }

        const categoriesScheme = generateCategoriesScheme(window.getConfig().chapters.blog);
        categoriesScheme.filter.push(...filters);

        let categories = await gudhub.jsonConstructor(categoriesScheme);
        categories = categories.categories;

        this.empty = false;

        const authorsScheme = generateAuthorsObjectScheme(window.getConfig().chapters.blog);
        authorsScheme.filter.push(...filters);
        const authors = await gudhub.jsonConstructor(authorsScheme);
        
        this.authors = authors.authors;

        if (this.type === "category") {
            // If this page type is category we fetch articles only of this category by using filter in jsonConstructor
            const url = new URL(window.location.href);
            const category = url.searchParams.get('category');
            this.currentCategory = categories.find(iterationCategory => iterationCategory.slug.includes(`/blog/${category}/`));
            const categoryId = this.currentCategory.category_id;

            const articlesAndCommentsScheme = await generateArticlesAndCommentsObject('category', categoryId, window.getConfig().chapters.blog);
            articlesAndCommentsScheme.childs.find(({ property_name }) => property_name === 'articles').filter.push(...filters);
            articlesAndComments = await gudhub.jsonConstructor(articlesAndCommentsScheme);

            articles = articlesAndComments.articlesAndComments;

            if (articles.articles.length === 0) {
                this.empty = 'category';
            }
        } else if (this.type === "author") {
            // If this page type is author we fetch articles only of this author by using filter in jsonConstructor
            this.currentCategory = false;
            const url = new URL(window.location.href);
            const pageSlug = url.searchParams.get('path');
            let currentAuthor = this.authors.find(author => author.slug == pageSlug);
            let author_id = currentAuthor.author_id;

            const articlesAndCommentsScheme = await generateArticlesAndCommentsObject('author', author_id, window.getConfig().chapters.blog);
            // articlesAndCommentsScheme.childs.find(({ property_name }) => property_name === 'articles').filter.push(...filters);
            articlesAndComments = await gudhub.jsonConstructor(articlesAndCommentsScheme);

            articles = articlesAndComments.articlesAndComments;

            if (articles.articles.length === 0) {
                this.empty = 'author';
            }
        }
        else {
            // Fetch all articles
            this.currentCategory = false;
            const articlesAndCommentsScheme = await generateArticlesAndCommentsObject(undefined, undefined, window.getConfig().chapters.blog);
            articlesAndCommentsScheme.childs.find(({ property_name }) => property_name === 'articles').filter.push(...filters);
            articlesAndComments = await gudhub.jsonConstructor(articlesAndCommentsScheme);

            articles = articlesAndComments.articlesAndComments;
        }

        let comments = articlesAndComments.articlesAndComments.comments;
        // Countings comments
        articles = articles.articles
        for (let article in articles) {
            let commentsQuantity = 0;
            for (let comment in comments) {
                if (comments[comment].article_id == articles[article].id) {
                    commentsQuantity++;
                }
            }
            articles[article].commentsQuantity = commentsQuantity;
        }

        this.articles = articles;

        for (let article = 0; article < this.articles.length; article++) {
            // CATEGORIES
            this.articles[article].rating.avg = Number(this.articles[article].rating.avg.toFixed(1));
            const post = this.articles[article];
            post.category = [];
            for (let category in post.categories) {
                let categoryName = this.articles[article].categories[category].fields.find(field => field.field_id == this.headingFieldId).field_value;
                let categorySlug = this.articles[article].categories[category].fields.find(field => field.field_id == this.slugFieldId).field_value;
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
            if (authorSlug) {
                this.articles[article].author_slug = authorSlug.slug
            }
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
        if (this.articles.length) {
            if (this.type != 'author') {
                const ogSiteImage = document.createElement('meta');
                ogSiteImage.setAttribute('property', 'og:image');
                ogSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}${this.articles[0].thumbnail_src}`);
                document.querySelector('head').prepend(ogSiteImage);
                
                const twitterSiteImage = document.createElement('meta');
                twitterSiteImage.setAttribute('name', 'twitter:image');
                twitterSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}${this.articles[0].thumbnail_src}`);
                document.querySelector('head').prepend(twitterSiteImage);
            }
            
            if (this.mainPost) {
                this.mainArticle = this.articles[0];
                this.articles = this.articles.slice(1, this.articles.length)
            } else {
                this.articles = this.articles
            }
        }


        // PAGINATION
        let postForPage;
        let lastPost;
        this.numberOfPage = 1;
        const url = new URL(window.location.href);
        this.page = url.searchParams.get('page');
        if (this.type != 'author') {
            // Using pagination everywhere but not on author's page
            if (!this.page) {
                this.numberOfPage = 1;
            } else {
                this.numberOfPage = Number(this.page);
                this.mainPost = false;
            }
            // Get how much posts on 1 page, check index of first post on this page 
            // (if we need 10 posts per page, on 1 page first post has index - 0, on 2 page first post has index 10)
            // then slice object with all posts from index of first post on this page to last post (last post = page number * posts per page)
            // page number getting from url
            let firstPost = (this.numberOfPage - 1) * this.postsPerPage;
            lastPost = this.numberOfPage * this.postsPerPage;
            articles = this.articles;
            postForPage = articles && articles.length > 0 ? articles.slice(firstPost, lastPost) : 0;
            if (postForPage.length == 0) {
                super.error('404');
            }
            this.postForPage = postForPage;
            
            this.countOfPages = [];
            this.countOfPages = Array.from(Array(Math.ceil(articles.length / this.postsPerPage)).keys());
            
            this.amountOfPages = Math.ceil(articles.length / this.postsPerPage)
        } else {
            articles = this.articles;
            this.amountOfPages = false;
            this.numberOfPage = 0;
            this.postForPage = articles;
        }
        
        super.render(html);
        

        if (articles && this.type != 'author') {
            if (lastPost < articles.length) {
                if (this.type == 'category') {
                    const url = new URL(window.location.href);
                    const category = url.searchParams.get('category');
                    fetch(`${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}/blog/${category}/page/${this.numberOfPage+1}/?mode=ssr`);
                } else {
                    fetch(`${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}/blog/page/${this.numberOfPage+1}/?mode=ssr`);
                }
            }
        }
    }

    // CLIENT
    async triggeringFetchArticles(item) {
        if (!this.fetchingNow && this.firstLoad) {
            this.fetchingNow = true;
            await this.checkArticlesLoaded(item);
            this.firstLoad = false;
            if (item.value.length > 1) {
                this.triggeringSearch(item);
            }
            this.fetchingNow = false;
        }
        item.addEventListener('customInput', await triggeringSearch.bind(this))
        function triggeringSearch(e) {
            this.triggeringSearch(e);
        }
    }
    async triggeringSearch(e) {
        let inputValue = e.target ? e.target.value : e.value;
        this.classList.add('hide_pagination');
        this.querySelector('.main') ? this.querySelector('.main').classList.add('hide') : '';
        if (inputValue.length > 1) {
            this.articles = this.searchMethod(this.allArticles, inputValue);
            await this.renderPosts(this.articles);
        } else if (inputValue.length === 0) {
            await this.renderPosts(this.allArticles);
        }
    }

    searchMethod(allArticles, inputValue) {
        if (allArticles) {
            let search = inputValue.toLowerCase();
            let searchedArticles = allArticles.filter(article => {
                let title = article.h1.toLowerCase();
                if (title.includes(search)) {
                    return true;
                }
            });
            return searchedArticles;
        }
    }

    async checkArticlesLoaded(item) {
        if (!this.allArticles) {
            this.allArticles = await this.fetchArticles(item);
            this.setIntro(this.allArticles);
            return this.articles == undefined ? this.allArticles : this.articles
        } else {
            return this.articles == undefined ? this.allArticles : this.articles
        }
    }
    loadingCallback() {
        this.classList.add('loading');
    }
    async fetchArticles(item) {
        let searchTarget = item;
        searchTarget.addEventListener('input', this.loadingCallback);

        const { api_app_id } = window.getConfig().chapters.blog;

        const response = await fetch(`https://gudhub.com/api/services/prod/api/${api_app_id}/articles`);
        const data = await response.json();
        let articles = data.articlesAndComments.articles;
        let comments = data.articlesAndComments.comments;
        let categories = data.articlesAndComments.categories;

        for (let article = 0; article < articles.length; article++) {
            // CATEGORIES
            articles[article].rating.avg = Number(articles[article].rating.avg.toFixed(1));
            const post = articles[article];
            post.category = [];
            for (let category in post.categories) {
                let categoryName = articles[article].categories[category].fields.find(field => field.field_id == categories[0].h1_id).field_value;
                let categorySlug = articles[article].categories[category].fields.find(field => field.field_id == categories[0].slug_id).field_value;
                let categoryObject = {
                    "name": categoryName,
                    "slug": categorySlug
                }
                post.category.push(categoryObject)
            }
            articles[article].categories = post.category;
            delete articles[article].category;
        }

        if (this.type === 'category') {
            const categoriesResponse = await fetch(`https://gudhub.com/api/services/prod/api/${api_app_id}/categories`)
            let categories = await categoriesResponse.json();
            categories = categories.categories;
            let category = window.location.pathname;
            if (category.includes('/page/')) {
                category = category.slice(0, category.indexOf('page/'))
            }
            this.currentCategory = categories.find(iterationCategory => iterationCategory.slug == category);
            const categoryId = this.currentCategory.category_id;
            // let articles;
            articles = articles.filter(article => {
                if (article.categories.find(category => category.slug == this.currentCategory.slug)) {
                    return true;
                }
                return false;
            });
            let posts = articles;
            articles.intro = await this.fetchIntro(posts);
            for (let article in posts) {
                let commentsQuantity = 0;
                for (let comment in comments) {
                    if (comments[comment].article_id == posts[article].id) {
                        commentsQuantity++;
                    }
                }
                posts[article].commentsQuantity = commentsQuantity;
            }
            return articles;
        }
        if (this.type === 'author') {
            const authorsResponse = await fetch(`https://gudhub.com/api/services/prod/api/${api_app_id}/authors`)
            let authors = await authorsResponse.json();
            authors = authors.authors;
            const author = window.location.pathname;
            this.currentAuthor = authors.find(iterationAuthor => iterationAuthor.slug == author);
            
            articles = articles.filter(article => article.author_id === this.currentAuthor.author_id);
            for (let article in articles) {
                articles[article].author_slug = this.currentAuthor.slug;
            }
            let posts = articles;
            articles.intro = await this.fetchIntro(posts);

            for (let article in posts) {
                let commentsQuantity = 0;
                for (let comment in comments) {
                    if (comments[comment].article_id == posts[article].id) {
                        commentsQuantity++;
                    }
                }
                posts[article].commentsQuantity = commentsQuantity;
            }
            return articles;
        }
        if (!this.allArticles) {
            let posts = articles;
            posts.intro = await this.fetchIntro(posts);

            for (let article in posts) {
                let commentsQuantity = 0;
                for (let comment in comments) {
                    if (comments[comment].article_id == posts[article].id) {
                        commentsQuantity++;
                    }
                }
                posts[article].commentsQuantity = commentsQuantity;
            }
            return posts;
        }
        return posts;
    }

    async fetchIntro(posts) {
        const { api_app_id, intro_field_id, app_id } = window.getConfig().chapters.blog;
        const fetchData = async (index, item_id) => {
            const responseIntro = await fetch(`https://gudhub.com/api/services/prod/api/${api_app_id}/get-intro?app_id=${app_id}&item_id=${item_id}&element_id=${intro_field_id}`);
            const dataIntro = await responseIntro.json();
            let introItems = JSON.parse(dataIntro.data).blocks[0].data;
            posts[index].intro = introItems;
        }
        const promises = [];

        for (let post in posts) {
            let itemIdOfPost = posts[post].id.split('.')[1];
            promises.push(fetchData(post, itemIdOfPost));
        }
        await Promise.all(promises);
        return posts;
    }

    setIntro(allArticles) {
        for (let article in allArticles) {
            let p = document.createElement('p');
            for (let item in allArticles[article].intro) {
                p.innerHTML += allArticles[article].intro[item];
            }
            if (allArticles[article].intro) {
                allArticles[article].intro = p.outerHTML;
            }
        }
    }

    async renderPosts(articles) {
        if (articles) {
            let input = this.querySelector('.search input');
        if (articles == undefined) {
            await this.triggeringFetchArticles(input);
            return false
        }
        input.removeEventListener('input', this.loadingCallback);
        input.classList.remove('loading');
        const wrapper = this.querySelector('.posts_list');
        wrapper.innerHTML = '';

        this.querySelector('.pagination') ? this.querySelector('.pagination').classList.add('hide') : '';

        if (articles.intro) {
            delete articles.intro;
        }

        if (!this.config) {
            this.config = window.getConfig().componentsConfigs.blog_config[0];
        }


        if (articles.length == 0) {
            const wrapper = this.querySelector('.posts_list');
        wrapper.innerHTML = '';
            wrapper.innerHTML = /*html*/`
            <div class="empty">
                <p style="color:var(--text-color);">${this.config.general_settings.search_failed_before} <span style="color:var(--h-color);">${input.value}</span>${this.config.general_settings.search_failed_after}</p>
            </div>
            `;
        } else {
            let authors;
            
            if (!articles[0].author_slug) {
                
                const { api_app_id } = window.getConfig().chapters.blog;
                const authorsResponse = await fetch(`https://gudhub.com/api/services/prod/api/${api_app_id}/authors`)
                authors = await authorsResponse.json();
                authors = authors.authors;
            }
            const wrapper = this.querySelector('.posts_list');
            wrapper.innerHTML = '';
            if (articles.commentsQuantity || articles.commentsQuantity === 0) {
                delete articles.commentsQuantity;
            }

            for (let article in articles) {
                if (!articles[article].author_slug && authors) {
                    let authorOfArticle = authors.find(author => author.author_id === articles[article].author_id);
                    articles[article].author_slug = authorOfArticle.slug;
                }
                let div = document.createElement('div');
                div.classList.add('post');
                div.innerHTML = /*html*/`
                <div class="post_left">
                    <a href="${articles[article].slug}">
                        <image-component data-rerender data-url="${articles[article].thumbnail}" data-src="${articles[article].thumbnail_src}" alt="${articles[article].thumbnail_alt}" title="${articles[article].thumbnail_title}"></image-component>
                    </a>
                </div> 
                <div class="post_right">
                    <div class="top">
                        <div class="top_flex">
                            <div>
                                <div class="categories">
                                
                                </div>
                            </div>
                            <div>
                                <div class="author_date">
                                    <div class="symbol">${this.config.general_settings.author}</div>
                                    <a class="author link" href="${articles[article].author_slug}">${articles[article].author}</a>
                                    <div class="symbol"> | </div>
                                    <div class="posted_at">
                                        ${new Date(Number(articles[article].posted_at)).toLocaleDateString('uk')}
                                    </div>
                                </div>
                                <div class="stats">
                                    <div class="time_to_read">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10.013 1.66699C14.6155 1.66699 18.3464 5.39783 18.3464 10.0003C18.3464 14.6028 14.6155 18.3337 10.013 18.3337C5.41052 18.3337 1.67969 14.6028 1.67969 10.0003C1.67969 5.39783 5.41052 1.66699 10.013 1.66699ZM10.013 3.33366C8.24491 3.33366 6.54922 4.03604 5.29897 5.28628C4.04873 6.53652 3.34635 8.23221 3.34635 10.0003C3.34635 11.7684 4.04873 13.4641 5.29897 14.7144C6.54922 15.9646 8.24491 16.667 10.013 16.667C11.7811 16.667 13.4768 15.9646 14.7271 14.7144C15.9773 13.4641 16.6797 11.7684 16.6797 10.0003C16.6797 8.23221 15.9773 6.53652 14.7271 5.28628C13.4768 4.03604 11.7811 3.33366 10.013 3.33366ZM10.013 5.00032C10.2171 5.00035 10.4141 5.07529 10.5667 5.21092C10.7192 5.34655 10.8166 5.53345 10.8405 5.73616L10.8464 5.83366V9.65532L13.1022 11.9112C13.2516 12.0611 13.3384 12.2624 13.3449 12.474C13.3513 12.6856 13.277 12.8918 13.137 13.0506C12.997 13.2094 12.8017 13.3089 12.591 13.329C12.3802 13.3491 12.1697 13.2882 12.0022 13.1587L11.9239 13.0895L9.42385 10.5895C9.29434 10.4599 9.21116 10.2912 9.18719 10.1095L9.17969 10.0003V5.83366C9.17969 5.61264 9.26748 5.40068 9.42376 5.2444C9.58004 5.08812 9.79201 5.00032 10.013 5.00032Z" fill="#545961"/></svg>
                                        <span>${articles[article].time_to_read}</span>
                                        <span>${this.config.general_settings.time_to_read}</span>
                                    </div>
                                    <div class="views">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"> <g clip-path="url(#clip0_2295_2463)"> <mask id="mask0_2295_2463" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"> <path d="M20 0H0V20H20V0Z" fill="white"/> </mask> <g mask="url(#mask0_2295_2463)"> <mask id="mask1_2295_2463" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"> <path d="M0 1.90735e-06H20V20H0V1.90735e-06Z" fill="white"/> </mask> <g mask="url(#mask1_2295_2463)"> <path d="M19.1719 10C19.1719 10 16.2031 16.25 9.95312 16.25C3.70312 16.25 0.734375 10 0.734375 10C0.734375 10 3.70312 3.75 9.95312 3.75C16.2031 3.75 19.1719 10 19.1719 10Z" stroke="#545961" stroke-width="1.5625" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.0781 10C13.0781 8.2741 11.679 6.875 9.95312 6.875C8.22723 6.875 6.82812 8.2741 6.82812 10C6.82812 11.7259 8.22723 13.125 9.95312 13.125C11.679 13.125 13.0781 11.7259 13.0781 10Z" stroke="#545961" stroke-width="1.5625" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> </g> </g> </g> <defs> <clipPath id="clip0_2295_2463"> <rect width="20" height="20" fill="white"/> </clipPath> </defs> </svg>
                                        <span>${articles[article].views}</span>
                                    </div>
                                    <div class="rating">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none"><path d="M9.5 0.839123L12.1266 6.15893L18 7.01203L13.75 11.1529L14.7532 17L9.5 14.2394L4.24678 17L5.25004 11.1529L1 7.01203L6.87335 6.15893L9.5 0.839123Z" stroke="#545961" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        <span>${articles[article].rating ? articles[article].rating.avg : ''}</span>
                                    </div>
                                    <div class="comments">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none"> <path d="M12.5156 8.79297C13.001 8.79297 13.3945 8.39947 13.3945 7.91406C13.3945 7.42866 13.001 7.03516 12.5156 7.03516C12.0302 7.03516 11.6367 7.42866 11.6367 7.91406C11.6367 8.39947 12.0302 8.79297 12.5156 8.79297Z" fill="#545961"/> <path d="M9 8.79297C9.48541 8.79297 9.87891 8.39947 9.87891 7.91406C9.87891 7.42866 9.48541 7.03516 9 7.03516C8.51459 7.03516 8.12109 7.42866 8.12109 7.91406C8.12109 8.39947 8.51459 8.79297 9 8.79297Z" fill="#545961"/> <path d="M5.48438 8.79297C5.96978 8.79297 6.36328 8.39947 6.36328 7.91406C6.36328 7.42866 5.96978 7.03516 5.48438 7.03516C4.99897 7.03516 4.60547 7.42866 4.60547 7.91406C4.60547 8.39947 4.99897 8.79297 5.48438 8.79297Z" fill="#545961"/> <path d="M17.2969 0.25H0.703125C0.314789 0.25 0 0.564789 0 0.953125V14.875C0 15.2633 0.314789 15.5781 0.703125 15.5781H6.92497L8.40551 17.9223C8.53436 18.1263 8.75876 18.25 9 18.25C9.24124 18.25 9.46564 18.1263 9.59449 17.9223L11.075 15.5781H17.2969C17.6852 15.5781 18 15.2633 18 14.875V0.953125C18 0.564789 17.6852 0.25 17.2969 0.25ZM16.5938 14.1719H10.6875C10.4463 14.1719 10.2219 14.2956 10.093 14.4995L9 16.2301L7.90699 14.4995C7.77814 14.2956 7.55374 14.1719 7.3125 14.1719H1.40625V1.65625H16.5938V14.1719Z" fill="#545961"/> </svg>
                                        <span>${articles[article].commentsQuantity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href="${articles[article].slug}">
                            <h3 class="post_title">
                                ${articles[article].h1}
                            </h3>
                        </a>
                    </div>
                    <div class="bottom">
                        <div class="intro">            
                            ${articles[article].intro}
                        </div>
                        <div class="read_more">
                            <a href="${articles[article].slug}" class="link">
                                <span>${this.config.general_settings.read_more}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"> <circle cx="10" cy="10" r="10" fill="#0A79FE"/> <path d="M8.25 6L12 9.75L8.25 13.5" stroke="white"/> </svg>
                            </a>
                        </div>
                    </div>
                </div>
                `;

                let categoriesWrapper = div.querySelector('.categories');

                if (articles[article].categories) {
                    articles[article].categories.forEach(category => {
                        categoriesWrapper.innerHTML += `
                        <div class="category">
                           <a href="${category.slug}" class="btn">${category.name}</a>
                        </div>`
                    })
                }

                wrapper.append(div);
            }
        }
        }
    }

    onClientReady() {
        let posts = this.querySelectorAll('.post');
        posts.forEach(post => {
            post.addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() != 'a' || e.target.closest('a')) {
                    window.location.href = post.querySelector('.post_title a').href;
                }
            })
        });
    }
}

window.customElements.define('posts-template', PostsTemplate);