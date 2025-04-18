import html from './image-component.html';
import brokenImageHtml from './image-component-broken-image.html';

class ImageComponent extends GHComponent {
    constructor() {
        super();
        this.placeholder = null;
    }

    async onServerRender() {
        await this.render('server');
    }

    async onClientReady() {
        window.addEventListener('load', () => {
<<<<<<< Updated upstream
            this.scriptForImproveLCP();
=======
            let timeout;
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                this.generateSources();
            }, 3000);
>>>>>>> Stashed changes
        });

        if (this.hasAttribute('data-rerender')) {
            await this.render('client');
        }
    }

    async render(caller) {
        this.src = this.getAttribute('src');
        this.alt = this.getAttribute('alt');
        this.title = this.getAttribute('title');
        this.lazyload = this.hasAttribute('lazyload');
        this.dataSrc = this.getAttribute('data-src');
        this.dataUrl = this.getAttribute('data-url');
        
        this.width = this.hasAttribute('width') ? this.getAttribute('width') : false;
        this.height = this.hasAttribute('height') ? this.getAttribute('height') : false;

        this.maxWidth = this.hasAttribute('data-max-width') ? this.this.getAttribute('data-max-width') : false;
        this.crop = this.hasAttribute('data-crop') ? this.getAttribute('data-crop') : false;

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
            const imageSrc = await this.uploadImagePath(this.src);
        
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
        
                this.image.src = imageSrc;
            });
        
            super.render(html);
        } catch (error) {
            console.error(`Rendering failed for ${this.src}.`);
        }

        // TODO: need to fix CSR
        // caller == 'client' ? this.clientRender() : super.render(html);
    }

    async uploadImagePath(imagePath) {
        const path = `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}/upload-image-path`;

        try {
            const response = await fetch(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imagePath })
            });
            const data = await response.json();
            this.placeholder = data?.base64_placeholder;

            return this.placeholder;
        } catch (error) {
            console.error('Error:', error);
            // return imagePath;
        }
    }

    generateSources() {
        console.log("this:", this);

        const picture = this.querySelector('picture');
        console.log("picture:", picture);

        const imageFromPicture = this.querySelector('picture img');
        // const ext = this.extension.startsWith('.') ? this.extension.substring(1) : this.extension;
    
        const sources = [];
    
        // if (this.imageWidth < 1200 && this.imageWidth > 600) {
        //     sources.push(this.createSource(`(min-width: 600px)`, `${this.path}${this.extension}.webp`, 'image/webp'));
        //     sources.push(this.createSource(`(min-width: 600px)`, `${this.path}${this.extension}`, `image/${ext}`));
        // }
    
        // if (this.imageWidth > 1200) {
        //     sources.push(this.createSource(`(max-width: 1200px) and (min-width: 600px)`, `${this.path}-1200${this.extension}.webp`, 'image/webp'));
        //     sources.push(this.createSource(`(max-width: 1200px) and (min-width: 600px)`, `${this.path}-1200${this.extension}`, `image/${ext}`));
        //     sources.push(this.createSource(`(min-width: 1200px)`, `${this.path}${this.extension}.webp`, 'image/webp'));
        //     sources.push(this.createSource(`(min-width: 1200px)`, `${this.path}${this.extension}`, `image/${ext}`));
        // }
    
        // if (this.imageWidth > 600) {
        //     sources.push(this.createSource(`(max-width: 600px)`, `${this.path}-600${this.extension}.webp`, 'image/webp'));
        //     sources.push(this.createSource(`(max-width: 600px)`, `${this.path}-600${this.extension}`, `image/${ext}`));
        // }
    
        // if (this.imageWidth <= 600) {
        //     const srcExt = this.src.split('.').pop();
        //     sources.push(this.createSource(null, `${this.src}.webp`, 'image/webp'));
        //     sources.push(this.createSource(null, `${this.src}`, `image/${srcExt}`));
        // }
    
        // picture.prepend(...sources.reverse());

        if (picture) {
            const dataSrc = this.getAttribute('src');

            const source = document.createElement('source');
            // if (media) source.setAttribute('media', media);
            source.setAttribute('srcset', dataSrc);
            source.setAttribute('type', "image/jpg");

            picture.prepend(source);
        }

        // if (imageFromPicture) {
            // imageFromPicture.src = `${this.path}${this.extension}`;
        // }
    }
    
    createSource(media, srcset, type) {
        const source = document.createElement('source');
        if (media) source.setAttribute('media', media);
        source.setAttribute('srcset', dataSrc);
        source.setAttribute('type', "image/jpg");
        return source;
    }

    // TODO: need to fix CSR
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
