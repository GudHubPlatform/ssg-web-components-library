class MetaIndex extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        document.querySelector('head').innerHTML += `
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        `;
        this.remove();
    }
}

window.customElements.define('meta-index', MetaIndex);