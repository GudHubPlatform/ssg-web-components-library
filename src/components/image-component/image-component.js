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
        this.placeholder = "data:image/gif+xml;base64,R0lGODlhAwADAJEAAMCZTW0zDCoaGgAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYjdjNjRjY2Y5LCAyMDI0LzA3LzE2LTEyOjM5OjA0ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjYuMCAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTY4Q0M3MUExNTI0MTFGMEI2NDZGMTVGMjU0Mzc4MkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTY4Q0M3MUIxNTI0MTFGMEI2NDZGMTVGMjU0Mzc4MkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NjhDQzcxODE1MjQxMUYwQjY0NkYxNUYyNTQzNzgyRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NjhDQzcxOTE1MjQxMUYwQjY0NkYxNUYyNTQzNzgyRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAAAAAAALAAAAAADAAMAAAIEVABmUAA7";
    }

    async onServerRender() {
        await this.render('server')
    }

    scriptForImproveLCP() {
        const sources = this.querySelectorAll('picture source');
        sources.forEach(element => {
            const trueSource = element.getAttribute('data-srcset');
            element.setAttribute('srcset', trueSource);
        });
    }

    async onClientReady() {
        window.addEventListener('load', () => {
            this.scriptForImproveLCP();
        });

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
