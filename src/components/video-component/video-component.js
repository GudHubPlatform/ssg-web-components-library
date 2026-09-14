import html from './video-component.html';
import './video-component.scss';

class VideoComponent extends GHComponent {

    async onServerRender() {
        this.videoSrc = this.getAttribute('src') || '';

        this.videoType = this.getAttribute('type') || 'video/mp4';

        /*
         * Static fallback:
         *
         * fallback-src="/assets/images/example.jpg"
         *
         * Remote GudHub fallback:
         *
         * fallback-url="https://app.gudhub.com/userdata/..."
         */
        this.fallbackSrc = this.getAttribute('fallback-src') || '';
        this.fallbackUrl = this.getAttribute('fallback-url') || '';

        this.fallbackAlt = this.getAttribute('fallback-alt') || '';
        this.fallbackTitle = this.getAttribute('fallback-title') || '';

        this.fallbackMaxWidth =
            this.getAttribute('fallback-max-width') || '';

        this.fallbackCrop =
            this.hasAttribute('fallback-crop');

        this.fallbackLazyload =
            this.hasAttribute('fallback-lazyload');

        /*
         * width + height are important for CLS.
         *
         * They define the aspect ratio BEFORE
         * image/video loading starts.
         */
        const width = Number(this.getAttribute('width'));
        const height = Number(this.getAttribute('height'));

        this.width = width > 0 ? width : 16;
        this.height = height > 0 ? height : 9;

        this.aspectRatio = `${this.width} / ${this.height}`;

        this.objectFit =
            this.getAttribute('object-fit') || 'contain';

        this.autoplay = this.hasAttribute('autoplay');

        /*
         * Autoplay generally requires muted video,
         * so autoplay implies muted.
         */
        this.muted =
            this.hasAttribute('muted') || this.autoplay;

        this.loop = this.hasAttribute('loop');

        this.playsinline =
            this.hasAttribute('playsinline');

        this.controls =
            this.hasAttribute('controls');

        this.preload =
            this.getAttribute('preload')
            || (this.autoplay ? 'auto' : 'metadata');

        super.render(html);
    }

    async onClientReady() {
        const wrapper = this.querySelector('.video-component');
        const video = this.querySelector('.video-component__video');

        if (!wrapper || !video) return;

        /*
         * Explicitly set muted as a property as well.
         * This is safer for autoplay across browsers.
         */
        if (this.hasAttribute('autoplay')) {
            video.muted = true;
        }

        const showVideo = () => {
            /*
             * loadeddata means the first video frame exists.
             *
             * Two requestAnimationFrame calls allow the browser
             * to paint it before removing the fallback.
             */
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    wrapper.classList.add(
                        'video-component--ready'
                    );

                    this.dispatchEvent(
                        new CustomEvent('video-ready')
                    );
                });
            });
        };

        video.addEventListener(
            'loadeddata',
            showVideo,
            { once: true }
        );

        video.addEventListener(
            'error',
            () => {
                wrapper.classList.add(
                    'video-component--error'
                );

                this.dispatchEvent(
                    new CustomEvent('video-error')
                );
            },
            { once: true }
        );

        /*
         * It is possible that the video was loaded
         * before onClientReady was executed.
         */
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            showVideo();
        }
    }
}

if (!window.customElements.get('video-component')) {
    window.customElements.define(
        'video-component',
        VideoComponent
    );
}