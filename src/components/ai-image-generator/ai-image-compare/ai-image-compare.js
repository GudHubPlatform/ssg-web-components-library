import html from './ai-image-compare.html';
import './ai-image-compare.scss';

class AiImageCompare extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        this.before = this.getAttribute('data-before') || '';
        this.after = this.getAttribute('data-after') || '';
        super.render(html);
        await this.addScripts();
    }

    async onClientRender() {
        this.initImageCompare();
        this.applyCalculatedStylesFromImage();
    }

    initImageCompare() {
        const element = this.querySelector("div#image-compare");
        const imageAfter = element.querySelector('#image-after')

        if (!element || typeof window.ImageCompare === 'undefined') {
            console.error("ImageCompare is not available or element not found.");
            return;
        }

        const options = {
            smoothing: false,
            controlColor: "#73c781",
            controlShadow: false,
            addCircle: true,
            addCircleBlur: true,
            hoverStart: true
        }
        new window.ImageCompare(element, options).mount();
        imageAfter.classList.remove('hidden');
    }

    addScripts() {
        const head = document.querySelector('head');

        const loadScript = () => {
            return new Promise((resolve, reject) => {
                if (document.getElementById('img-compare-script')) return resolve();

                const script = document.createElement('script');
                script.id = 'img-compare-script';
                script.src = 'https://unpkg.com/image-compare-viewer/dist/image-compare-viewer.min.js';
                script.onload = resolve;
                script.onerror = reject;
                head.appendChild(script);
            });
        };

        const loadStyle = () => {
            if (document.getElementById('img-compare-style')) return;
            const link = document.createElement('link');
            link.id = 'img-compare-style';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/image-compare-viewer/dist/image-compare-viewer.min.css';
            head.appendChild(link);
        };

        loadStyle();
        return loadScript();
    }

    applyCalculatedStylesFromImage() {
        const imageCompare = this.querySelector('#image-compare');
        const imageBefore = this.querySelector('#image-before');
        const header = document.querySelector('header-component header');

        if (!imageCompare || !imageBefore || !header) return;

        const apply = () => {
            const imageWidth = imageBefore.naturalWidth;
            const imageHeight = imageBefore.naturalHeight;
            const headerHeight = header.offsetHeight;

            const viewportHeight = window.innerHeight;
            const scale = viewportHeight / imageHeight;
            const calculatedWidth = imageWidth * scale - headerHeight;
            const calculatedMarginLeft = (calculatedWidth - window.innerWidth) / 2;

            imageCompare.style.minWidth = `${calculatedWidth}px`;
            imageCompare.style.marginLeft = `-${calculatedMarginLeft}px`;
        };

        if (imageBefore.complete) {
            apply();
        } else {
            imageBefore.addEventListener('load', apply);
        }
    }
}

window.customElements.define('ai-image-compare', AiImageCompare);
