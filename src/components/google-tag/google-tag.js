class GoogleTag extends GHComponent {
    constructor() {
        super();
    }

    onClientRender() {
        const timeout = parseInt(this.getAttribute('data-timeout')) || 3000;
        const googleId = this.getAttribute('data-googleId');
        const script = document.createElement('script');

        if (!googleId) {
            script.innerHTML = 'No google id for tag'
        } else {
            script.innerHTML = `
                window.addEventListener('load', function () {
                    setTimeout(function () {
                        (function(w, d, s, l, i) {
                            w[l] = w[l] || [];
                            w[l].push({
                                'gtm.start': new Date().getTime(),
                                event: 'gtm.js'
                            });
                            var f = d.getElementsByTagName(s)[0],
                                j = d.createElement(s),
                                dl = l != 'dataLayer' ? '&l=' + l : '';
                            j.async = true;
                            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                            f.parentNode.insertBefore(j, f);
                        })(window, document, 'script', 'dataLayer', '${googleId}');
                    }, ${timeout});
                });
            `;
        }

        document.querySelector('body').appendChild(script);
        this.remove();
    }
}

window.customElements.define('google-tag', GoogleTag);