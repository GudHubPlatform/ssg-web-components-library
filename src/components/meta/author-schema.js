import authorsObject from "./authors.json";

class AuthorSchema extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {

        if (!window.location.href.includes("/page/")) {
            let authors = await gudhub.jsonConstructor(authorsObject);
            authors = authors.authors;

            const url = new URL(window.location.href);
            const slug = url.searchParams.get('path');

            let author = authors.find(author => author.slug === slug);
            
            let socLinks = [author.facebook, author.linkedin];
            
            const getContent = (link) => {
                return new Promise(async (resolve) => {
                    const response = await fetch(link);
                    const content = await response.text();
                    const div = document.createElement('div');
                    div.insertAdjacentHTML('beforeend', content);
                    resolve(div.innerText);
                });
            }
                
            author.description = await getContent(author.description)
            let schema = {
                "@context": "https://schema.org",
                "@id": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + author.slug,
                "@type": "Person",
                "name": author.name,
                "givenName": author.name.split(' ')[0],
                "familyName": author.name.split(' ')[1],
                "description": JSON.parse(author.intro).blocks[0].data.text,
                "knowsAbout": author.description,
                "jobTitle": author.description,
                "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + author.slug,
                "knowsLanguage": [
                    "English",
                    "Ukrainian"
                ],
                "image": {
                    "@type": "ImageObject",
                    "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.constants.website}` + author.thumbnail_src,
                    "author": {
                        "@type": "Person",
                        "name": author.name
                    }
                },
                "sameAs": socLinks
            }

            if (!document.head.querySelector('#authorSchema')) {

                document.head.innerHTML += `
                    <script id="authorSchema" type="application/ld+json">${JSON.stringify(schema)}</script>
                `;

            }
            this.remove()
        }
    }

}

window.customElements.define('author-schema', AuthorSchema);