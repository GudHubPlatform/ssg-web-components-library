import html from './text-and-video.html';
import './text-and-video.scss';
import jsonTemplate from './text-and-video-data.json';

class TextAndVideo extends GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        super.render(html);
    }
    onClientRender() {
        this.addEventListener();
    }
    
    addEventListener() {
        const buttonMore = document.querySelector(".button-more");
        if(buttonMore) {
            const buttonText = buttonMore.querySelector("span")
            const moreTextButton = document.querySelector(".text-wrapper p.more.text"); 
        
            moreTextButton.classList.add("hidden");
        
            buttonMore.addEventListener("click", () => {
                if (moreTextButton.classList.contains("hidden")) {
                    moreTextButton.classList.remove("hidden");
                    moreTextButton.classList.add("visible");
                    buttonText.innerText = "Less"
                } else {
                    moreTextButton.classList.remove("visible");
                    moreTextButton.classList.add("hidden");
                    buttonText.innerText = "More"
                }
            });
        }

    }
}

window.customElements.define('text-and-video', TextAndVideo);
