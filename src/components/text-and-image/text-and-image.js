import html from './text-and-image.html';
import './text-and-image.scss';
import jsonTemplate from './text-and-image-data.json';


class TextAndImage extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
        this.readMore = this.getAttribute('data-read-more') || null;
        this.readMoreText = this.getAttribute('data-read-more-text') || '{"more": "Read more", "less": "Read less"}';
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        super.render(html);
    }
    onClientRender() {
        if(this.readMore) {
            this.readMoreText = JSON.parse(this.readMoreText);
            this.addEventListener();
        }
    }

    addEventListener() {
        const wrapper = this.querySelector("text-and-image .paragraphs-wrapper");
        const buttonMore = this.querySelector("text-and-image .button-more");
        const buttonText = buttonMore.querySelector("span")
        buttonText.innerText = this.readMoreText.more

        buttonMore.addEventListener("click", () => {
            if (wrapper.classList.contains("open")) {
                wrapper.classList.remove("open");
                buttonText.innerText = this.readMoreText.more
            } else {
                wrapper.classList.add("open");
                buttonText.innerText = this.readMoreText.less
            }
        });
    }
}

window.customElements.define('text-and-image', TextAndImage);
