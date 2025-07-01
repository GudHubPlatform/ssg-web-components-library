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
}

window.customElements.define('ai-image-compare', AiImageCompare);
