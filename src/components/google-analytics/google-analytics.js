class GoogleAnalytics extends GHComponent {
    constructor() {
        super();
    }

    onClientRender() {
        const timeout = parseInt(this.getAttribute('data-timeout')) || 3000;
        const googleId = this.getAttribute('data-googleId');
        const script = document.createElement('script');

        if (!googleId) {
            script.innerHTML = 'No google id for analytics'
        } else {
            script.innerHTML = `
                window.addEventListener('load', function () {
                    setTimeout(function () {
                        const gtagScript = document.createElement('script');
                        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=${googleId}';
                        gtagScript.async = true;
                        document.head.appendChild(gtagScript);

                        gtagScript.onload = function () {
                            window.dataLayer = window.dataLayer || [];
                            function gtag() {
                                dataLayer.push(arguments);
                            }
                            window.gtag = gtag;
                            gtag('js', new Date());
                            gtag('config', '${googleId}');
                        };
                    }, ${timeout});
                });
            `;
        }

        document.querySelector('body').appendChild(script);
        this.remove();
    }
}

window.customElements.define('google-analytics', GoogleAnalytics);