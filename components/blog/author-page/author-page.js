import html from './author-page.html';
import './author-page.scss';

import authorObject from './author-page.json';

class AuthorPage extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {
        const url = new URL(window.location.href);
        const authorSlug = url.searchParams.get('path');

        this.author = await gudhub.jsonConstructor(
            {
                "type": "array",
                "id": 1,
                "childs": authorObject,
                "property_name": "author",
                "app_id": "33453",
                "filter": [
                  {
                    "field_id": 796213,
                    "data_type": "radio_button",
                    "valuesArray": [
                      "1"
                    ],
                    "search_type": "equal_or",
                    "$$hashKey": "object:3722",
                    "selected_search_option_variable": "Value"
                  },
                  {
                    "field_id": 796222,
                    "data_type": "radio_button",
                    "valuesArray": [
                      "1"
                    ],
                    "search_type": "equal_or",
                    "$$hashKey": "object:3764",
                    "selected_search_option_variable": "Value"
                  },
                  {
                    "field_id": 796214,
                    "data_type": "text",
                    "valuesArray": [
                      authorSlug
                    ],
                    "search_type": "contain_or",
                    "$$hashKey": "object:3802",
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