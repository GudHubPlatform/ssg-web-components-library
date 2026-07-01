import html from './video-slider.html';
import './video-slider.scss';

import wipeLeft from './animations/wipe-left.js';
import fade from './animations/fade.js';
import zoom from './animations/zoom.js';
import multiStrip from './animations/multi-strip.js';
import cascadeStrips from './animations/cascade-strips.js';
import sectors from './animations/sectors.js';

class VideoSlider extends GHComponent {
    constructor() {
        super();

        this.animations = {
            wipeLeft,
            fade,
            zoom,
            multiStrip,
            cascadeStrips,
            sectors
        };
    }

    async onServerRender() {

        this.ghId = this.getAttribute('data-gh-id') || null;
        this.chapter = this.getAttribute('data-chapter') || 'pages';
        this.json = this.ghId 
            ? await super.getGhData(this.ghId, this.chapter)
            : console.error('data-gh-id attribute is required for video-slider component');

        if (
            !this.json ||
            !Array.isArray(this.json.images) ||
            this.json.images.length === 0
        ) {
            this.remove();
            return;
        }

        this.setAttribute(
            'data-animation',
            this.json.animation
        );

        this.setAttribute(
            'data-slide-duration',
            this.json.slideDuration
        );

        this.setAttribute(
            'data-transition-duration',
            this.json.transitionDuration
        );

        this.setAttribute(
            'data-images',
            JSON.stringify(this.json.images)
        );
    
        super.render(html);
    }

    async onClientReady() {

        this.config = {
            animation: this.getAttribute('data-animation'),

            slideDuration:
                Number(this.getAttribute('data-slide-duration')),

            transitionDuration:
                Number(this.getAttribute('data-transition-duration'))
        };

        this.images = JSON.parse(this.getAttribute('data-images'));

        this.canvas = this.querySelector('canvas');

        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 1280;
        this.canvas.height = 720;

        this.loadedImages = await this.preloadImages();

        this.startLoop();
    }

    preloadImages() {
        return Promise.all(
            this.images.map((url) => {
                return new Promise((resolve, reject) => {

                    const image = new Image();

                    image.onload = () => {
                        resolve(image);
                    };

                    image.onerror = () => reject(url);

                    image.src = url;
                });
            })
        );
    }

    startLoop() {
        this.startTime = performance.now();

        const render = (time) => {
            const elapsed = time - this.startTime;

            const totalSlides = this.loadedImages.length;

            const singleSlideTotal =
                this.config.slideDuration + this.config.transitionDuration;

            const totalDuration =
                singleSlideTotal * totalSlides;

            const timelineTime =
                elapsed % totalDuration;

            const currentSlide =
                Math.floor(timelineTime / singleSlideTotal);

            const nextSlide =
                (currentSlide + 1) % totalSlides;

            const localTime =
                timelineTime % singleSlideTotal;

            const isTransitionPhase =
                localTime >= this.config.slideDuration;

            const transitionTime =
                localTime - this.config.slideDuration;

            const progress = isTransitionPhase
                ? transitionTime / this.config.transitionDuration
                : 0;

            this.renderFrame({
                currentImage: this.loadedImages[currentSlide],
                nextImage: this.loadedImages[nextSlide],
                progress,
                isTransitionPhase,
            });

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    renderFrame({
        currentImage,
        nextImage,
        progress,
        isTransitionPhase,
    }) {
        if (!currentImage) return;

        const animation =
            this.animations[this.config.animation];

        if (!animation) return;

        animation({
            ctx: this.ctx,
            canvas: this.canvas,
            currentImage,
            nextImage,
            progress,
            isTransitionPhase,
            images: this.loadedImages,
        });
    }
}

window.customElements.define('video-slider', VideoSlider);