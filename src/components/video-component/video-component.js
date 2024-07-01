import html from './video-component.html';
import './video-component.scss';

class VideoComponent extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        const isVideoWithOwnPoster = this.hasAttribute('data-video-with-poster');

        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);
        this.video = this.json.video;
        this.poster = this.json.poster;

        this.getVideoAttributes = this.getVideoAttributes.bind(this);

        super.render(html);

        if (isVideoWithOwnPoster) {
            this.changeVideoVariant();
        }
    }

    onClientReady() {
        const videoContainer = this.querySelector(`section[]`);
        const video = this.querySelector('video');
        const poster = this.querySelector('.initial-image');

        video.addEventListener('canplaythrough', () => {
            poster.style.display = 'none';
            video.style.display = 'block';
        });

        video.load();

        videoContainer.addEventListener('click', function() {
            if (video.paused) {
                video.play();
            }
        });
    }

    getVideoAttributes() {
        let attributesDataResult = ``;

        this.autoplay = this.hasAttribute('data-autoplay') ? 'autoplay muted' : null;
        this.controls = this.hasAttribute('data-controls') ? 'controls' : null;
        this.muted = this.hasAttribute('data-muted') ? 'muted' : null;
        this.loop = this.hasAttribute('data-loop') ? 'loop' : null;

        const attributes = [this.autoplay, this.controls, this.muted, this.loop];

        attributes.forEach(item => {
            if (attributes.length <= 0) return;

            if (item) {
                return attributesDataResult += `${item} `;
            }
        })

        return attributesDataResult;
    }

    changeVideoVariant() {
        const poster = document.querySelector('.initial-image');
        const video = document.querySelector('video');
        const videoWithPoster = this.hasAttribute('data-video-with-poster') ? this.poster : null;

        poster.style.display = 'none';
        
        if (videoWithPoster) {
            video.setAttribute('poster', videoWithPoster);
            video.setAttribute('controls', '');
        }
    }
}

window.customElements.define('video-component', VideoComponent);
