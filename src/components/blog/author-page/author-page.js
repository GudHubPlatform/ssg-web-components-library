import html from './author-page.html';
import './author-page.scss';

import generateAuthorPageScheme from './author-page-scheme.js';

class AuthorPage extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {
        const url = new URL(window.location.href);
        const authorSlug = url.searchParams.get('path');

        const {
          app_id,
          type_field_id,
          status_field_id,
          slug_field_id
        } = window.constants.chapters.blog;

        this.author = await gudhub.jsonConstructor(
            {
                "type": "array",
                "id": 1,
                "childs": generateAuthorPageScheme(window.constants.chapters.blog),
                "property_name": "author",
                "app_id": app_id,
                "filter": [
                  {
                    "field_id": type_field_id,
                    "data_type": "radio_button",
                    "valuesArray": [
                      "1"
                    ],
                    "search_type": "equal_or",
                    "selected_search_option_variable": "Value"
                  },
                  {
                    "field_id": status_field_id,
                    "data_type": "radio_button",
                    "valuesArray": [
                      "1"
                    ],
                    "search_type": "equal_or",
                    "selected_search_option_variable": "Value"
                  },
                  {
                    "field_id": slug_field_id,
                    "data_type": "text",
                    "valuesArray": [
                      authorSlug
                    ],
                    "search_type": "contain_or",
                    "selected_search_option_variable": "Value"
                  }
                ]
              }
        )
        this.author = this.author.author[0];

        const ogSiteImage = document.createElement('meta');
        ogSiteImage.setAttribute('property', 'og:image');
        ogSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.author.thumbnail_src}`);
        document.querySelector('head').prepend(ogSiteImage);

        const twitterSiteImage = document.createElement('meta');
        twitterSiteImage.setAttribute('name', 'twitter:image');
        twitterSiteImage.setAttribute('content', `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}${this.author.thumbnail_src}`);
        document.querySelector('head').prepend(twitterSiteImage);

        let readableCategories = [];
        for (let category in  this.author.categories) {
            let slug = this.author.categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.slug_field_id).field_value;
            let title = this.author.categories[category].fields.find(field => field.field_id == window.constants.chapters.blog.heading_field_id).field_value;
            let categoriesObject = {
                "title": title,
                "slug": slug
            };
            readableCategories.push(categoriesObject);
        }
        this.author.categories = readableCategories;

        const getContent = (link) => {
            return new Promise(async (resolve) => {
                const response = await fetch(link);
                const content = await response.text();
                const div = document.createElement('div');
                div.insertAdjacentHTML('beforeend', content);
                resolve(div.innerText);
            });
          }

        this.author.description = await getContent(this.author.description);

        // INTRO
        const promises = [];
        promises.push(new Promise(async (resolve) => {
            let content = await gudhub.getInterpretationById(window.constants.chapters.blog.app_id, this.author.id.split('.')[1], this.author.intro_id, 'html');
            this.author.intro = content;
            resolve();
        }));


        await new Promise(resolve => {
            Promise.all(promises).then(() => {
                resolve();
            })
        });

        super.render(html);
    }

}

window.customElements.define('author-page', AuthorPage);