import html from './page-banner-image-and-menu.html';
import './page-banner-image-and-menu.scss';
import jsonTemplate from './page-banner-image-and-menu-data.json';


class PageBannerImageAndMenu extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.breadcrumbs = this.getAttribute('data-breadcrumbs') || null;
        this.json = await super.getGhData(this.ghId);

        this.menuList = this.json.menu;

        super.render(html);
        this.initServicesDropdown(this.menuList)
    }
    
    onClientReady() {
        if (!document.querySelector('script#swiper_script')) {
            const script = document.createElement('script');
            
            script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
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
                clearInterval(interval);
            }
        }, 500);

        this.initSlider();
        this.addEventListener();
    }

    initSlider() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        let swiper = new Swiper(`.render-links .swiper`, {
            slidesPerView: "auto",
            navigation: {
                nextEl: ".reviews_slider_next",
                prevEl: ".reviews_slider_prev",
            },
            breakpoints: {
                650: {
                    slidesPerView: "auto"
                }
            },
        });

        // const renderLinks = document.querySelectorAll('.render-links-wrapper .render-link');
        // if (window.innerWidth < 651) return;
        // const slideToActive = () => {
        //     const activeLink = document.querySelector('.render-link.active');
        //     if (activeLink) {
        //         const slide = activeLink.closest('.swiper-slide').getAttribute('aria-label').split('/')[0];
        //         swiper.slideTo(slide - 1);
        //     }
        // };

        // const updateActiveLink = () => {
        //     renderLinks.forEach(link => {
        //         if (window.location.href.includes(link.getAttribute('href'))) {
        //             renderLinks.forEach(l => l.classList.remove('active'));
        //             link.classList.add('active');
        //         }
        //     });
        // };

        // updateActiveLink();
        // slideToActive();
        // window.addEventListener('hashchange', updateActiveLink);

    }

    initServicesDropdown(obj) {
        const listWrapper = this.querySelector('.services-dropdown-wrapper');
        const list = listWrapper.querySelector('.services-dropdown');

        obj.forEach((item) => {
            const li = document.createElement("li");

            if(window.location.search.includes(item.link)) {
                li.classList.add('active');
            }

            const a = document.createElement('a');
            a.textContent = item.title;
            a.href = item.link;
            li.appendChild(a);
            list.appendChild(li);
        });
    }

    addEventListener() {
        console.log(3)
        const servicesDropdown = document.querySelector('.services-dropdown-wrapper');
        if (!!servicesDropdown) {
            const list = servicesDropdown.querySelector('.services-dropdown');
            const button = servicesDropdown.querySelector('.read-more span');
            const buttonText = servicesDropdown.querySelector('.read-more span span.text');
            const buttonSvg = servicesDropdown.querySelector('.read-more span svg');

            button.addEventListener('click', () => {
                if (list.classList.contains("open")) {
                    list.classList.remove("open");
                    buttonText.innerText = "More Services"
                    buttonSvg.style.transform = "rotate(0deg)"
                } else {
                    list.classList.add('open');
                    buttonText.innerText = "Less Services"
                    buttonSvg.style.transform = "rotate(-90deg)"
                }
            })
        }

    }
}

window.customElements.define('page-banner-image-and-menu', PageBannerImageAndMenu);
