import html from './grid-component.html';
import './grid-component.scss';
import jsonTemplate from './grid-component-data.json';
import svgPlaceholder from '../svgPlaceholder.js'

class GridComponent extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);
        
        this.svgPlaceholder = svgPlaceholder;

        this.items = this.json.items;

        const gridItem = this.children[0];
        if (gridItem) {
            this.gridItemTag = gridItem.tagName.toLowerCase();
        }

        if (this.ghId) {
            super.render(html);
        }
    }

    onClientReady() {
        if (this.isSlider()) {
            this.enableSlider();
        }
    }

    openPopup (el) {
        const popupId = el.getAttribute('data-popup-id');
        window.dispatchEvent( new CustomEvent('open-popup', {
            detail: {
                popupId,
                placement: this.tagName.toLowerCase()
            }
        }));
    }
    
    isSlider() {
        return this.offsetWidth < 700 && this.hasAttribute('be-slider');
    }

    enableSlider() {
        this.createSlidersElements();

        if(!document.querySelector('script#swiper_script')) {
                    const script = document.createElement('script');
                    
                    script.setAttribute('src', '/assets/js/swiper.js');
                    script.setAttribute('async', '');
                    script.setAttribute('id', 'swiper_script');
                    
                    document.querySelector('body').appendChild(script);
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
                        console.log(Swiper);
                        this.initSlider();
                        clearInterval(interval);
                    }
                }, 500);
    }
    
    initSlider(){
        let slider_items = this.querySelector('.grid').children;
        for (let item = 0; item < slider_items.length; item++){
            slider_items[item].classList.add('swiper-slide');
        }
        let swiper = new Swiper(`.grid_slider.${this.name}`, {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 10,
            autoHeight: true,
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
    
    createSlidersElements(){
        let beSlider = this.hasAttribute('be-slider');
        if( beSlider ){
            this.querySelector('.grid').classList.add('swiper-wrapper');

            this.querySelector('.grid_slider').classList.add('grid-swiper');
            this.querySelector('.grid_slider').classList.add(`${this.name}`);
            this.querySelector('.grid_slider').classList.add('swiper');
            
            let gridsSliderPrev = document.createElement('div');
            gridsSliderPrev.classList.add('grids_slider_prev');
            gridsSliderPrev.classList.add('swiper-button-prev');
            this.querySelector('.navigation_wrapper').append(gridsSliderPrev);
            
            
            let gridsSliderNext = document.createElement('div');
            gridsSliderNext.classList.add('grids_slider_next');
            gridsSliderNext.classList.add('swiper-button-next');
            this.querySelector('.navigation_wrapper').append(gridsSliderNext);
            
            let swiperPaginationNum = document.createElement('div');
            swiperPaginationNum.classList.add('swiper_pagination_num');
            swiperPaginationNum.classList.add('swiper-pagination');

            this.querySelector('.navigation_wrapper').append(swiperPaginationNum);
        }
    }
}

window.customElements.define('grid-component', GridComponent);