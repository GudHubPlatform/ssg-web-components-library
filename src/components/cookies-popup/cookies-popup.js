import html from "./cookies-popup.html";
import "./cookies-popup.scss";

class CookiesPopup extends GHComponent {
    constructor() {
        super();
        this.inEU = false;
        fetch("https://ipapi.co/json/").then((response) => response.json()).then((data) => this.inEU = data.in_eu);
    }

    async onServerRender() {
        super.render(html);
    }

    async onClientReady() {
        if (this.inEU) {
            if (localStorage.getItem("agreeWithCookies") === false) {

                this.classList.add("show");

                const script = document.createElement('script');
                script.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('consent', 'default', {
                        'ad_storage': 'denied',
                        'analytics_storage': 'denied',
                        'functionality_storage': 'denied',
                        'security_storage': 'granted',
                        'wait_for_update': 500
                    });
                `;

                document.querySelector('head').prepend(script);

            } else {
                setTimeout(() => {

                    gtag('consent', 'update', {
                        'ad_storage': 'granted',
                        'analytics_storage': 'granted',
                        'functionality_storage': 'granted',
                        'security_storage': 'granted',
                        'personalization_storage': 'granted',
                        'wait_for_update': 500
                    });

                }, 3500);
            }
        }

    }

    gotIt() {
        localStorage.setItem("agreeWithCookies", "true");
        this.classList.add("hide");

        gtag('consent', 'update', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted',
            'functionality_storage': 'granted',
            'security_storage': 'granted',
            'personalization_storage': 'granted',
            'wait_for_update': 500
        });

    }
}

window.customElements.define("cookies-popup", CookiesPopup);
