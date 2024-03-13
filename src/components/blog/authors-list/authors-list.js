import html from './authors-list.html';
import './authors-list.scss';

import generateAuthorsListScheme from './authors-list-scheme.js';

import {initBlogConfig} from '../initBlogConfig.js';

class AuthorsList extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {
        
        this.config = initBlogConfig(window.constants.blog_config);
        
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.authors = await gudhub.jsonConstructor(generateAuthorsListScheme(window.constants.chapters.blog));
        this.authors = this.authors.authors;
        const getContent = (link) => {
            return new Promise(async (resolve) => {
                const response = await fetch(link);
                const content = await response.text();
                const div = document.createElement('div');
                div.insertAdjacentHTML('beforeend', content);
                resolve(div.innerText);
            });
          }
        for ( let author in this.authors ) {
            this.authors[author].description = await getContent(this.authors[author].description);
        }
        
        // INTRO
        const promises = [];
        this.authors.forEach((author, index) => {
            promises.push(new Promise(async (resolve) => {
                let content = await gudhub.getInterpretationById(window.constants.chapters.blog.app_id, author.id.split('.')[1], author.intro_id, 'html');
                this.authors[index].intro = content;
                resolve();
            }));
        });


        await new Promise(resolve => {
            Promise.all(promises).then(() => {
                resolve();
            })
        });

        const ogSiteImage = document.createElement('meta');
        ogSiteImage.setAttribute('property', 'og:image');
        ogSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.authors[0].thumbnail_src}`);
        document.querySelector('head').prepend(ogSiteImage);

        const twitterSiteImage = document.createElement('meta');
        twitterSiteImage.setAttribute('name', 'twitter:image');
        twitterSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.authors[0].thumbnail_src}`);
        document.querySelector('head').prepend(twitterSiteImage);

        super.render(html);
    }

    onClientReady() {
        let author = this.querySelectorAll('.author');
        author.forEach(author => {
            author.addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() != 'a' || e.target.closest('a')) {
                    window.location.href = author.querySelector('.post_title a').href;
                }
            })
        });
    }
}

window.customElements.define('authors-list', AuthorsList);