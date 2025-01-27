import html from './image-component.html';
import placeholderHtml from './image-component-placeholder.html';
class ImageComponent extends GHComponent {
    /*
     * src - path to static image 
     * alt - alternative text
     * title - title
     * lazyload - if image must have loading="lazy" 
     * dataSrc - url to image on gudhub (for dynamic images like a thumbnail of articles)
     * dataUrl - path to place where image from dataSrc will be save (for dynamic images like a thumbnail of articles)
     * data-rerender - for rerendering this component on client
     * width - width
     * height - height
     */
    constructor() {
        super();
    }

    async onServerRender() {
        await this.render('server')
        
    }
    async onClientReady() {
        if (this.hasAttribute('data-rerender')) {
            await this.render('client')
        }
    }
    async render (caller) {
        this.src = this.getAttribute('src');
        this.alt = this.getAttribute('alt');
        this.title = this.getAttribute('title');
        this.lazyload = this.hasAttribute('lazyload');
        this.dataSrc = this.getAttribute('data-src');
        this.dataUrl = this.getAttribute('data-url');
        
        this.width = this.hasAttribute('width') ? this.getAttribute('width') : false;
        this.height = this.hasAttribute('height') ? this.getAttribute('height') : false;
        if (!this.src && !this.dataUrl && !this.dataSrc) {
            super.render(placeholderHtml);
            return
        }
        // Download image from gudhub (this.dataUrl ) to cache (this.dataSrc)
        await new Promise(async (resolve) => {
            if(this.dataSrc && this.dataUrl && !window.disableImagesRegeneration) {
                await fetch(this.dataSrc + '?source=' + this.dataUrl + '&mode=ssr');
                this.src = this.dataSrc;
                resolve();
            } else {
                if(this.src) {
                    await fetch(this.src + '?mode=ssr');
                    resolve();
                }
            }
        })
        
        let attempts = 0;
        let imageLoaded = false;

        while (!imageLoaded && attempts < 5) {
            try {
                await new Promise(async (resolve, reject) => {
                    // Use new Image to have ability get params like from real image, for example naturalWidth
                    this.image = new Image();

                    this.image.addEventListener('load', () => {
                        const srcHasParams = this.image.getAttribute('src').indexOf('?') !== -1;
                        let src = srcHasParams ? this.image.getAttribute('src').substring(0, this.image.getAttribute('src').indexOf('?')) : this.image.getAttribute('src');
                        if (src.indexOf('&') !== -1) {
                            src = src.substring(0, src.indexOf('&'))
                        }
                        this.extension = src.substring(src.lastIndexOf('.'), src.length);
                        this.path = src.substring(0, src.length - this.extension.length);

                        this.imageWidth = this.image.naturalWidth;

                        imageLoaded = true;

                        resolve();
                    });

                    this.image.onerror = () => {
                        reject();
                    };

                    this.image.setAttribute('src', this.src);
                });
            } catch (error) {
                console.error(`Image load failed "${this.src}". Attempt "${attempts + 1}"`);
                attempts++;
            }
        }
        if (imageLoaded) {
            super.render(html);
        } else {
            console.error(`Image load failed "${this.src}".`);
        }
        // caller == 'client' ? this.clientRender() : super.render(html);
    }

    // clientRender() {
    //     this.innerHTML = /*html*/`
    //     <picture data-natural-width="${this.imageWidth}">
    //         ${ (this.imageWidth < 1200) && (this.imageWidth > 600) ? `
    //             <source media="(min-width: 600px)" srcset="${this.path}${this.extension}.webp" type="image/webp">
    //             <source media="(min-width: 600px)" srcset="${this.path}${this.extension}" type="image/${this.extension.substring(1, this.extension.length)}">
    //         ` : ''}
    //         ${ this.imageWidth > 600 ? `
    //             <source media="(max-width: 600px)" srcset="${this.path}-600${this.extension}.webp" type="image/webp">
    //         ` : ''}
    //         ${ this.imageWidth > 1200 ? `
    //             <source media="(max-width: 1200px)" srcset="${this.path}-1200${this.extension}.webp" type="image/webp">
    //             <source media="(min-width: 1200px)" srcset="${this.path}${this.extension}.webp" type="image/webp">
    //         ` : ''}
    //         ${ this.imageWidth > 600 ? `
    //             <source media="(max-width: 600px)" srcset="${this.path}-600${this.extension}" type="image/${this.extension.substring(1, this.extension.length)}">
    //         ` : ''}
    //         ${ this.imageWidth > 1200 ? `
    //             <source media="(max-width: 1200px)" srcset="${this.path}-1200${this.extension}" type="image/${this.extension.substring(1, this.extension.length)}">
    //             <source media="(min-width: 1200px)" srcset="${this.path}${this.extension}" type="image/${this.extension.substring(1, this.extension.length)}">
    //         ` : ''}
    //         ${ this.imageWidth <= 600 ? `
    //             <source srcset="${this.src}" type="image/${this.src.split('.')[this.src.split('.').length - 1]}" />
    //         ` : ''}
    //         <source srcset="${this.src}.webp" type="image/webp">
    //         <img src="${this.src}" ${ this.title ? `title="${this.title}"` : '' } ${ this.alt ? `alt="${this.alt}"` : '' } ${ this.lazyload ? 'loading="lazy"' : '' } ${ this.width ? `width="${this.width}"` : '' } ${ this.height ? `height="${this.height}"` : '' } >
    //     </picture>
    //     `;
    // }
}

if(!window.customElements.get('image-component')) {
    window.customElements.define('image-component', ImageComponent);
}