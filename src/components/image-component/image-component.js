import html from './image-component.html';
import brokenImageHtml from './image-component-broken-image.html';
import placeholderImageHtml from './image-component-placeholder.html';

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
            let timeout;
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                this.generateSources();
            }, 2000);
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

        this.maxWidth = this.hasAttribute('data-max-width') ? this.getAttribute('data-max-width') : false;
        this.isCrop = this.hasAttribute('data-crop') ? this.hasAttribute('data-crop') : false;

        // If no valid src or data URL is provided, render a placeholder
        if (!this.src && !this.dataUrl && !this.dataSrc) {
            super.render(placeholderImageHtml);
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
            if (this.dataSrc && this.dataUrl) {
                await this.uploadImagePath(this.dataSrc, this.dataUrl);
            } else if (this.src) {
                await this.uploadImagePath(this.src);
            }

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
        
                this.image.src = this.placeholder || this.src;
            });
        
            super.render(html);
        } catch (error) {
            console.error(`Rendering failed for ${this.src}.`);
        }

        // TODO: need to fix CSR
        // caller == 'client' ? this.clientRender() : super.render(html);
    }

    async uploadImagePath(imagePath, imageUrl = null) {
        const path = `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}/upload-image-path`;

        try {
            const response = await fetch(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imagePath,
                    imageUrl,
                    maxWidth: Number(this.maxWidth),
                    isCrop: this.isCrop
                })
            });
            const data = await response.json();
            this.placeholder = data?.base64_placeholder;
        } catch (error) {
            console.error('Error:', error);
            return imagePath;
        }
    }

    generateSources() {
        const picture = this?.querySelector('picture');
        const imageFromPicture = picture?.querySelector('img');
    
        if (!imageFromPicture) {
            console.warn('No image found inside <picture>.');
            return;
        }
    
        const dataSrc = this.getAttribute('data-src');
        const dataUrl = this.getAttribute('data-url');
        const fallbackSrc = this.getAttribute('src');
        const dataMaxWidth = parseInt(this.getAttribute('data-max-width'), 10);
    
        const src = dataSrc && dataUrl ? dataSrc : fallbackSrc;
    
        if (!src) {
            console.warn('No valid image source found.');
            return;
        }
    
        const lastDotIndex = src.lastIndexOf('.');
        if (lastDotIndex === -1) {
            console.warn('Invalid image source format.');
            return;
        }
    
        const extension = src.substring(lastDotIndex);
        const mimeType = `image/${extension.slice(1)}`;
        const path = src.substring(0, lastDotIndex);
    
        const sources = [];
    
        const createResponsiveSources = (media, suffix = '') => {
            sources.push(this.createSource(media, `${path}${suffix}${extension}`, mimeType));
            sources.push(this.createSource(media, `${path}${suffix}${extension}.webp`, 'image/webp'));
        };
    
        // Add sources based on available size information
        if (!isNaN(dataMaxWidth)) {
            // Largest case: original image ≥ 1200px
            if (dataMaxWidth >= 1200) {
                createResponsiveSources('(max-width: 600px)', '-600');
                createResponsiveSources('(min-width: 600px) and (max-width: 1200px)', '-1200');
                createResponsiveSources('(min-width: 1200px)', '');
            }
            // Medium case: original image ≥ 600px but < 1200px
            else if (dataMaxWidth >= 600) {
                createResponsiveSources('(max-width: 600px)', '-600');
                createResponsiveSources('(min-width: 600px)', '');
            }
            // Small image: only original is available
            else {
                createResponsiveSources(null, '');
            }
        } else {
            // If max width is not known, assume all variants exist
            createResponsiveSources('(max-width: 600px)', '-600');
            createResponsiveSources('(min-width: 600px) and (max-width: 1200px)', '-1200');
            createResponsiveSources('(min-width: 1200px)', '');
        }
    
        // Add sources to the <picture> element
        if (picture && sources.length) {
            picture.prepend(...sources.reverse());
        }
    
        // Set fallback <img> source
        if (imageFromPicture) {
            imageFromPicture.src = `${path}${extension}`;
        }
    }       
    
    createSource(media, srcset, type) {
        const source = document.createElement('source');
        if (media) source.setAttribute('media', media);
        source.setAttribute('srcset', srcset);
        source.setAttribute('type', type);
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
