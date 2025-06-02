import html from "./cookies-popup.html";
import "./cookies-popup.scss";

class CookiesPopup extends GHComponent {
    constructor() {
        super();
        this.linkToPage = this.getAttribute('data-page') || "/privacy-policy/";
    }

    async onServerRender() {
        super.render(html);
    }
    async onClientReady() {
        let inEU = localStorage.getItem("inEU");

        try {
            if (inEU == null) {
                await fetch("https://ipapi.co/json/")
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.country === "UA") {
                            inEU = true;
                        } else {
                            inEU = data.in_eu;
                        }
                        localStorage.setItem("inEU", inEU.toString());
                    });
            } else {
                inEU = (inEU === "true");
            }
        } catch (error) {
            inEU = true;
        }

        if (inEU) {
            let hasDayPassed = this.checkTime();
            let showPopup = (localStorage.getItem("agreeWithCookies") == null) || (localStorage.getItem("agreeWithCookies") === "false" && hasDayPassed);

            if (showPopup) {
                this.classList.add("show");

                const script = document.createElement('script');
                script.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('consent', 'default', {
                        'ad_personalization': 'denied',
                        'ad_user_data': 'denied',
                        'ad_storage': 'denied',
                        'analytics_storage': 'denied',
                        'functionality_storage': 'denied',
                        'security_storage': 'granted',
                        'wait_for_update': 500
                    });
                `;

                document.querySelector('head').prepend(script);
            }

            if(localStorage.getItem("agreeWithCookies") === "true") this.gotIt();
        }
    }

    async gotIt() {
        localStorage.setItem("agreeWithCookies", "true");
        this.classList.add("hide");

        let ifGtagExist = await this.checkGtag();
        if (ifGtagExist) {
            gtag('consent', 'update', {
                'ad_personalization': 'granted',
                'ad_user_data': 'granted',
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'functionality_storage': 'granted',
                'security_storage': 'granted',
                'personalization_storage': 'granted',
                'wait_for_update': 500
            });
        }

    }
    decline() {
        const now = Date.now();
        localStorage.setItem("cookieConsentTime", now.toString());

        localStorage.setItem("agreeWithCookies", "false");
        this.classList.add("hide");

    }
    close() {
        this.classList.add("hide");
    }

    checkGtag() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (typeof gtag === 'function') {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(interval);
                resolve(false);
            }, 5100);
        });
    }
    checkTime() {
        const savedTime = localStorage.getItem("cookieConsentTime");

        if (savedTime) {
            const savedTimestamp = parseInt(savedTime, 10);
            const now = Date.now();

            const oneDayInMs = 24 * 60 * 60 * 1000;

            const hasDayPassed = now - savedTimestamp > oneDayInMs;

            if (hasDayPassed) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}

window.customElements.define("cookies-popup", CookiesPopup);