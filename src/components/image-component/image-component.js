import html from './image-component.html';
import brokenImageHtml from './image-component-broken-image.html';

class ImageComponent extends GHComponent {
    /*
        * src - path to static image 
        * alt - alternative text
        * title - title
        * lazyload - if image must have loading="lazy" 
        * dataSrc - path to file in which image from dataUrl will be saved  || example: data-src="/asserts/blog/top-web-development-books.jpg"
        * dataUrl - url to image || example: data-url="https://gudhub.com/userdata/29883/1083204.jpg"
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

        // If no valid src or data URL is provided, render a placeholder
        if (!this.src && !this.dataUrl && !this.dataSrc) {
            super.render(brokenImageHtml);
            return;
        }

        // Download image from GudHub (this.dataUrl) to cache (this.dataSrc)
        if (!window.disableImagesRegeneration) {
            if (this.dataSrc && this.dataUrl) {
                try {
                    await fetch(`${this.dataSrc}?source=${this.dataUrl}&mode=ssr`);
                    this.src = this.dataSrc;
                } catch (error) {
                    console.error('Failed to fetch dataSrc:', error);
                }
            } else if (this.src) {
                try {
                    await fetch(`${this.src}?mode=ssr`);
                } catch (error) {
                    console.error('Failed to fetch src:', error);
                }
            }
        }
        
        try {
            await new Promise((resolve, reject) => {
                this.image = new Image();
    
                this.image.addEventListener('load', () => {
                    const srcHasParams = this.image.getAttribute('src').includes('?');
                    let src = srcHasParams ? this.image.getAttribute('src').split('?')[0] : this.image.getAttribute('src');
                    if (src.includes('&')) {
                        src = src.split('&')[0];
                    }
                    
                    this.extension = src.substring(src.lastIndexOf('.'));
                    this.path = src.substring(0, src.length - this.extension.length);
                    this.imageWidth = this.image.naturalWidth;
                    
                    this.dispatchEvent(new Event('loaded'));
                    resolve();
                });
    
                this.image.addEventListener('error', () => {
                    console.error(`Image load failed: ${this.src}`);
                    super.render(brokenImageHtml);
                    reject();
                });
    
                this.image.src = this.src;
            });
    
            super.render(html);
        } catch (error) {
            console.error(`Rendering failed for ${this.src}.`);
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

if (!window.customElements.get('image-component')) {
    window.customElements.define('image-component', ImageComponent);
}
