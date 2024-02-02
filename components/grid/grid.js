import html from './grid.html';
import './grid.scss';

class Grid extends GHComponent {
    /**
     * data-subtitle - boolean , default true
     * data-background-image - path to image on background
     * data-collapse = plus for special icon, use with data-type="etc"
     * data-type = number / shadow / icons / border / etc
     * be-slider without value - with this attribute grid will be slider on mobile
     * 
     * 
     * class = centered / dark_theme / centered_items
     */
    constructor() {
        super();
        this.ghId = this.getAttribute('data-gh-id') || null;
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.beSlider = this.hasAttribute('be-slider');
        this.subtitle = this.hasAttribute('data-subtitle') ? this.getAttribute('data-subtitle') : true;

        const json = await super.getGhData(this.ghId);

        this.jsonData = json;

        this.backgroundImage = this.hasAttribute('data-background-image') ? this.getAttribute('data-background-image') : false;
        if (this.backgroundImage) {
            this.style.backgroundImage = `url(${this.backgroundImage})`;
        }

        this.collapse = this.getAttribute('data-collapse') || null;
        this.type = this.getAttribute('data-type') || null;

        this.items = json.items;
        super.render(html);
        if (this.beSlider) {
            this.querySelector('.grid_slider').classList.add(`${this.ghId}`)
        }
    }

    onClientReady() {

        if (window.innerWidth < 600 || this.beSlider) {
            this.connectSwiper();
        }
    }

    connectSwiper() {
        if (!document.querySelector('script#swiper_script')) {
            const script = document.createElement('script');

            script.setAttribute('src', '/assets/js/swiper.js');
            script.setAttribute('id', 'swiper_script');

            document.querySelector('head').appendChild(script);
        }
        if (!document.querySelector('link#swiper_style')) {
            const link = document.createElement('link');

            link.setAttribute('href', '/assets/css/swiper.css');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('id', 'swiper_style');

            document.querySelector('head').appendChild(link);
        }
        const interval = setInterval(() => {
            if (typeof Swiper !== 'undefined') {
                this.initSlider();
                clearInterval(interval);
            }
        }, 500);
    }
    initSlider() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        if (this.querySelector('.swiper-wrapper.grid_wrapper')) {
            let slider_items = this.querySelector('.swiper-wrapper.grid_wrapper').children;
            for (let item = 0; item < slider_items.length; item++) {
                slider_items[item].classList.add('swiper-slide');
            }

            let swiper = new Swiper(`.grid_slider.${this.ghId}`, {
                slidesPerView: 1,
                observer: true,
                observeParents: true,
                cache: false,
                navigation: {
                    nextEl: ".grids_slider_next",
                    prevEl: ".grids_slider_prev",
                },
                pagination: {
                    el: ".swiper_pagination_num",
                    type: "fraction",
                },
            });
        }
    }

    openItem(item) {
        let items = this.querySelectorAll('.grid_item');
        if (item.classList.contains('active')) {
            item.classList.remove('active')
        } else {
            items.forEach(element => {
                element.classList.remove('active')
            });
            item.classList.add('active')
        }
    }

}

window.customElements.define('grid-old', Grid);