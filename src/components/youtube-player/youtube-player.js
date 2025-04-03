import html from './youtube-player.html';
import './youtube-player.scss';

class YoutubePlayer extends GHComponent {
    constructor() {
        super();
    }

    onServerRender() {
        this.poster = this.getAttribute('data-poster') || null

        super.render(html);
    }
    onClientRender() {
        const link = this.getAttribute('data-link') || null
        this.video = `
            <iframe 
                src="${link}"
                title="video"
                frameborder="0"
                allow="accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
            ></iframe>`;
    
        this.addEventListeners();
    }
    addEventListeners() {
        const poster = this.querySelector('.youtube-player image-component');
        const loader = this.querySelector('.loader')
        const videoWrapper = this.querySelector('.video-wrapper')
        
        poster.addEventListener('click', () => {
            poster.classList.add('hidden');
            loader.classList.add('visible');

            videoWrapper.innerHTML = this.video;
            loader.classList.remove('visible');
        })
    }
}

customElements.define('youtube-player', YoutubePlayer);