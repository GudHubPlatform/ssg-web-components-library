import html from './reviews-slider.html';
import './reviews-slider.scss';
import jsonTemplate from './reviews-slider-data.json';
class ReviewsSlider extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.ghId = this.getAttribute('data-gh-id') || null;
    }
    
    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        this.json = await super.getGhData(this.ghId);
        
        this.items = this.json.items;
        super.render(html);
    }

    onClientReady() {
        if(!document.querySelector('script#swiper_script')) {
            const script = document.createElement('script');
            
            script.setAttribute('src', '/assets/js/swiper.js');
            script.setAttribute('id', 'swiper_script');
            
            document.querySelector('head').appendChild(script);
        }
        if(!document.querySelector('link#swiper_style')) {
            const link = document.createElement('link');
            
            link.setAttribute('href', '/assets/css/swiper.css');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('id', 'swiper_style');
            
            document.querySelector('head').appendChild(link);
        }
        const interval = setInterval(() => {
            if(typeof Swiper !== 'undefined') {
                this.initSlider();
                clearInterval(interval);
            }
        }, 500);
    }
    
    initSlider() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        let swiper = new Swiper(`.reviews_slider.${this.ghId}`, {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
            centeredSlidesBounds: true,
            grabCursor: true,
            loop: true,
            navigation: {
                nextEl: ".reviews_slider_next",
                prevEl: ".reviews_slider_prev",
            },
            on: {
                click() {
                    swiper.slideTo(this.clickedIndex);    
                },
            },
            breakpoints: {
                1150: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                  autoHeight: false,
                },
                880: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                  autoHeight: false,
                }
              },
        });

    }

    setActive(item) {
        item.classList.add('swiper-slide-next')
    }
}

window.customElements.define('reviews-slider', ReviewsSlider);