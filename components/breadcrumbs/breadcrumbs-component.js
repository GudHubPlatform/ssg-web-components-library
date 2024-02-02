import html from './breadcrumbs.html';
import './breadcrumbs.scss';

class BreadcrumbsComponent extends GHComponent {
    /**
     * data-items - in this attribute need set stringified object with items of list of breadcrumbs
     */
    constructor() {
        super();
    }

    async onServerRender() {
        
        let url = new URL(window.location.href);
        url = url.searchParams.get('path');
        if (url !== '/') {
            this.items = this.getAttribute('data-items');
            this.items = JSON.parse(this.items);

            const schema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}`
                    }
                ]
            }


            this.items.forEach((bc, index) => {
                let realIndex = index + 1;
                if(index < this.items.length - 1) {
                    schema.itemListElement.push({
                        "@type": "ListItem",
                        "position": (realIndex == 0 ? 1 : realIndex) + 1,
                        "name": bc.title,
                        "item": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + bc.slug
                    })
                } else {
                    schema.itemListElement.push({
                        "@type": "ListItem",
                        "position": (realIndex == 0 ? 1 : realIndex) + 1,
                        "name": bc.title,
                    })
                }
            });
            if(!document.head.querySelector('#breadcrumbsSchema')) {

                document.head.innerHTML += `
                    <script id="breadcrumbsSchema" type="application/ld+json">${JSON.stringify(schema)}</script>
                `;

            }

            super.render(html);
        }
    }

}

window.customElements.define('breadcrumbs-component', BreadcrumbsComponent);