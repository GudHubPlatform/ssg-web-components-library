import html from './image-component.html';
import brokenImageHtml from './image-component-broken-image.html';
import placeholderImageHtml from './image-component-placeholder.html';

class ImageComponent extends GHComponent {
    constructor() {
        super();
        this.placeholder = null;
        this.generatedImageSrc = null;
    }

    async onServerRender() {
        await this.render();
    }

    async onClientReady() {
        // If the element has "data-rerender" we repeat render, but already on client side
        if (this.hasAttribute('data-rerender')) {
            await this.render();
        }

        this.generateSources();
    }

    async render() {
        this.src = this.getAttribute('src');
        this.alt = this.getAttribute('alt');
        this.title = this.getAttribute('title');
        this.dataUrl = this.getAttribute('data-url');
        this.lazyload = this.hasAttribute('lazyload');
        
        this.width = this.hasAttribute('width') ? this.getAttribute('width') : false;
        this.height = this.hasAttribute('height') ? this.getAttribute('height') : false;

        this.isCrop = this.hasAttribute('data-crop') ? this.hasAttribute('data-crop') : false;
        this.maxWidth = this.hasAttribute('data-max-width') ? this.getAttribute('data-max-width') : false;

        // If no valid src or data URL is provided, render a placeholder
        if (!this.src && !this.dataUrl) {
            super.render(placeholderImageHtml);
            return;
        }

        const getAppAndFileIds = (url) => {
            if (!url) return;

            const cleanUrl = url.split('?')[0].replace(/\/+$/, ''); // remove query & trailing slash
            const parts = cleanUrl.split('/');

            const appId = parts[parts.length - 2];
            const fileName = parts[parts.length - 1];
            const fileId = fileName.split('.')[0];

            return { appId, fileId };
        };

        const buildImagePath = (meta, route) => {
            const url = new URL(meta.url);
            const extension = url.pathname.split('.').pop();
            return `/assets/images${route}/${meta.file_name}.${extension}`;
        };

        try {
            let relativeImagePath = this.src;

            if (this.dataUrl) {
                const { appId, fileId } = getAppAndFileIds(this.dataUrl);
                const imageMetaData = await gudhub.getFile(appId, fileId);

                if (imageMetaData?.url && imageMetaData?.file_name) {
                    const currentRoute = new URL(window.location.href).searchParams.get('path') || '';
                    const normalizedRoute = currentRoute.startsWith('/') ? currentRoute : `/${currentRoute}`;

                    relativeImagePath = buildImagePath(imageMetaData, normalizedRoute);
                }
            }

            this.generatedImageSrc = relativeImagePath;

            // Download image from GudHub (this.dataUrl) to cache (this.generatedImageSrc)
            if (window?.imagesRegeneration) {
                if (this.generatedImageSrc && this.dataUrl) {
                    try {
                        await fetch(`${this.generatedImageSrc}?source=${this.dataUrl}&mode=ssr`);
                        this.src = this.generatedImageSrc;
                    } catch (error) {
                        console.error('Failed to fetch generatedImageSrc:', error);
                    }
                } else if (this.src) {
                    try {
                        await fetch(`${this.src}?mode=ssr`);
                    } catch (error) {
                        console.error('Failed to fetch src:', error);
                    }
                }
            }

            const payload = {
                imageSrc: this.generatedImageSrc,
                imageUrl: this.dataUrl ?? null
            };

            await this.uploadImagePath(payload);

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
                    this.dataSrc = this.generatedImageSrc;
        
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
    }

    async uploadImagePath({ imageSrc = null, imageUrl = null }) {
        const path = `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}/upload-image-path`;
        const isImagesRegeneration = window?.imagesRegeneration;

        try {
            const response = await fetch(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageSrc,
                    imageUrl,
                    maxWidth: Number(this.maxWidth),
                    isCrop: this.isCrop,
                    isImagesRegeneration
                })
            });
            const data = await response.json();
            this.placeholder = data?.base64_placeholder;
        } catch (error) {
            console.error('Error:', error);
            return imageSrc;
        }
    }

    generateSources() {
        const picture = this?.querySelector('picture');
        const imageFromPicture = picture?.querySelector('img');
    
        if (!imageFromPicture) {
            console.warn('No image found inside <picture>.');
            return;
        }
    
        const dataSrc = imageFromPicture.getAttribute('data-src');
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
}

if (!window.customElements.get('image-component')) {
    window.customElements.define('image-component', ImageComponent);
}
