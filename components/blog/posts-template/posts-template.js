import html from './posts-template.html';
import './posts-template.scss';

import categoriesObject from './categories.json';
import authorsObject from './authors-object.json';

import { generateArticlesAndCommentsObject } from '../../../generate-articles-and-comments-object.js';

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
        
        this.headingFieldId = this.environment === 'server' ? window.constants.chapters.blog.heading_field_id : false;
        this.slugFieldId = this.environment === 'server' ? window.constants.chapters.blog.slug_field_id : false;
    }
    
    async onServerRender() {

        this.mainPost = this.hasAttribute('data-main-post');


        let articlesAndComments;
        let articles;

        let categories = await gudhub.jsonConstructor(categoriesObject);
        categories = categories.categories;

        this.empty = false;

        const authors = await gudhub.jsonConstructor(authorsObject);
        this.authors = authors.authors;

        if (this.type === "category") {
            // If this page type is category we fetch articles only of this category by using filter in jsonConstructor
            const url = new URL(window.location.href);
            const category = url.searchParams.get('category');
            this.currentCategory = categories.find(iterationCategory => iterationCategory.slug == `/blog/${category}/`);
            const categoryId = this.currentCategory.category_id;
            articlesAndComments = await gudhub.jsonConstructor(await generateArticlesAndCommentsObject('category', categoryId));

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
            articlesAndComments = await gudhub.jsonConstructor(await generateArticlesAndCommentsObject('author', author_id));

            articles = articlesAndComments.articlesAndComments;

            if (articles.articles.length === 0) {
                this.empty = 'author';
            }
        }
        else {
            // Fetch all articles
            this.currentCategory = false;
            articlesAndComments = await gudhub.jsonConstructor(await generateArticlesAndCommentsObject());

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
        if (this.articles.length) {
            if (this.type != 'author') {
                const ogSiteImage = document.createElement('meta');
                ogSiteImage.setAttribute('property', 'og:image');
                ogSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.articles[0].thumbnail_src}`);
                document.querySelector('head').prepend(ogSiteImage);
                
                const twitterSiteImage = document.createElement('meta');
                twitterSiteImage.setAttribute('name', 'twitter:image');
                twitterSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.articles[0].thumbnail_src}`);
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
                    fetch(`${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}/blog/${category}/page/${this.numberOfPage+1}/?mode=ssr`);
                } else {
                    fetch(`${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}/blog/page/${this.numberOfPage+1}/?mode=ssr`);
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
        const response = await fetch(`https://gudhub.com/api/services/prod/api/33455/articles`);
        const data = await response.json();
        let articles = data.articlesAndComments.articles;
        let comments = data.articlesAndComments.comments;
        let categories = data.articlesAndComments.categories;
        console.log(articles)
        console.log(comments)
        console.log(categories)
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
            const categoriesResponse = await fetch('https://gudhub.com/api/services/prod/api/33364/categories')
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
            const authorsResponse = await fetch('https://gudhub.com/api/services/prod/api/33364/authors')
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
        const fetchData = async (index, item_id) => {
            const responseIntro = await fetch(`https://gudhub.com/api/services/prod/api/33364/get-intro?app_id=33361&item_id=${item_id}&element_id=794786`);
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

        if (articles.length == 0) {
            const wrapper = this.querySelector('.posts_list');
        wrapper.innerHTML = '';
            wrapper.innerHTML = /*html*/`
            <div class="empty">
                <p style="color:#525252">No results found for <span style="color:#1b1b1d">${input.value}</span>. Try a new search.</p>
            </div>
            `;
        } else {
            let authors;
            
            if (!articles[0].author_slug) {
                
                const authorsResponse = await fetch('https://gudhub.com/api/services/prod/api/33364/authors')
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
                                <div class="time_to_read">
                                    <span class="time_to_read_target">${articles[article].time_to_read}</span>
                                    <span>min read</span>
                                </div>
                            </div>
                            <div>
                                <div class="views">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none"> <g clip-path="url(#clip0_841_1707)"> <mask id="mask0_841_1707" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21"> <path d="M20 0.5H0V20.5H20V0.5Z" fill="white"/> </mask> <g mask="url(#mask0_841_1707)"> <mask id="mask1_841_1707" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21"> <path d="M0 0.500002H20V20.5H0V0.500002Z" fill="white"/> </mask> <g mask="url(#mask1_841_1707)"> <path d="M19.1719 10.5C19.1719 10.5 16.2031 16.75 9.95312 16.75C3.70312 16.75 0.734375 10.5 0.734375 10.5C0.734375 10.5 3.70312 4.25 9.95312 4.25C16.2031 4.25 19.1719 10.5 19.1719 10.5Z" stroke="#0C6980" stroke-width="1.5625" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.0781 10.5C13.0781 8.7741 11.679 7.375 9.95312 7.375C8.22723 7.375 6.82812 8.7741 6.82812 10.5C6.82812 12.2259 8.22723 13.625 9.95312 13.625C11.679 13.625 13.0781 12.2259 13.0781 10.5Z" stroke="#0C6980" stroke-width="1.5625" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> </g> </g> </g> <defs> <clipPath id="clip0_841_1707"> <rect width="20" height="20" fill="white" transform="translate(0 0.5)"/> </clipPath> </defs> </svg>
                                    <span>${articles[article].views}</span>
                                </div>
                                <div class="rating">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none"> <path d="M9.5 1.33912L12.1266 6.65893L18 7.51203L13.75 11.6529L14.7532 17.5L9.5 14.7394L4.24678 17.5L5.25004 11.6529L1 7.51203L6.87335 6.65893L9.5 1.33912Z" stroke="#0C6980" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                                    <span>${articles[article].rating ? articles[article].rating.avg : ''}</span>
                                </div>
                                <div class="comments">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none"> <g id="Group"> <g id="Group_2"> <g id="Group_3"> <path id="Vector" d="M12.8477 9.29297C13.3331 9.29297 13.7266 8.89947 13.7266 8.41406C13.7266 7.92866 13.3331 7.53516 12.8477 7.53516C12.3622 7.53516 11.9688 7.92866 11.9688 8.41406C11.9688 8.89947 12.3622 9.29297 12.8477 9.29297Z" fill="#0C6980"></path> <path id="Vector_2" d="M9.33203 9.29297C9.81744 9.29297 10.2109 8.89947 10.2109 8.41406C10.2109 7.92866 9.81744 7.53516 9.33203 7.53516C8.84662 7.53516 8.45312 7.92866 8.45312 8.41406C8.45312 8.89947 8.84662 9.29297 9.33203 9.29297Z" fill="#0C6980"></path> <path id="Vector_3" d="M5.81641 9.29297C6.30181 9.29297 6.69531 8.89947 6.69531 8.41406C6.69531 7.92866 6.30181 7.53516 5.81641 7.53516C5.331 7.53516 4.9375 7.92866 4.9375 8.41406C4.9375 8.89947 5.331 9.29297 5.81641 9.29297Z" fill="#0C6980"></path> <path id="Vector_4" d="M17.6289 0.75H1.03516C0.64682 0.75 0.332031 1.06479 0.332031 1.45312V15.375C0.332031 15.7633 0.64682 16.0781 1.03516 16.0781H7.257L8.73754 18.4223C8.86639 18.6263 9.09079 18.75 9.33203 18.75C9.57327 18.75 9.79768 18.6263 9.92652 18.4223L11.4071 16.0781H17.6289C18.0172 16.0781 18.332 15.7633 18.332 15.375V1.45312C18.332 1.06479 18.0172 0.75 17.6289 0.75ZM16.9258 14.6719H11.0195C10.7783 14.6719 10.5539 14.7956 10.425 14.9995L9.33203 16.7301L8.23902 14.9995C8.11018 14.7956 7.88577 14.6719 7.64453 14.6719H1.73828V2.15625H16.9258V14.6719Z" fill="#0C6980"></path> </g> </g> </g> </svg>
                                    <span>${articles[article].commentsQuantity}</span>
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
                        <div class="author_date">
                            <div class="symbol">By</div>
                            <a class="author" href="${articles[article].author_slug}">${articles[article].author}</a>
                            <div class="symbol"> | </div>
                            <div class="posted_at">
                                ${new Date(Number(articles[article].posted_at)).toLocaleDateString('uk')}
                            </div>
                        </div>
                        <div class="intro">            
                            ${articles[article].intro}
                        </div>
                        <div class="read_more">
                            <a href="${articles[article].slug}">
                                <span>Read more</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17" fill="none">
                                    <path d="M12.5 1L20 8.5M20 8.5L12.5 16M20 8.5L0 8.5" stroke="#141616" stroke-width="2"/>
                                </svg>
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
                           <a href="${category.slug}">${category.name}</a>
                        </div>`
                    })
                }

                wrapper.append(div);
            }
        }
        }
    }

}

window.customElements.define('posts-template', PostsTemplate);