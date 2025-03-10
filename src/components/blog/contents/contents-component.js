import html from './contents.html';
import './contents.scss';

class ContentsComponent extends GHComponent {
    
    constructor() {
        super();
    }

    async onServerRender() {
        this.title = this.getAttribute('data-title') || null;
        this.headings = JSON.parse(this.getAttribute('data-headings'));
        this.newHeadings = [];
        const fullUrl = new URL('http://website.com' + window.location.search);
        const url = fullUrl.searchParams.get('path');
        for (const heading of this.headings) {
            let div = document.createElement('div');
            div.innerHTML = heading.text;

            const linkInside = div.querySelector('a');
            let text = linkInside ? `<span>${linkInside.innerText}</span>` : heading.text;

            let textId = text.match(/>(.*?)</)[1].replace(/ /g, '-');

            this.newHeadings.push({
                text: text,
                level: heading.level,
                link: `${url}#${textId}`,
            });
        }

        super.render(html);
    }

    onClientReady() {
        this.scrollContent()
    }

    openContents (item) {
        item.parentElement.classList.toggle('active');
    }

    scrollContent(){
        let anchorSections = document.querySelectorAll('article h2, article h3');

        let anchors = document.querySelectorAll('.aside_wrapper contents-component .h_list li a');

        function changeLinkState() {
            
            let index = anchorSections.length;

            while (--index && window.scrollY + 110 < anchorSections[index].offsetTop) { }

            window.anchor = anchorSections[index];
            for (let anchor = 0; anchor < anchors.length; anchor++) {
                anchors[anchor].parentElement.classList.remove('active-anchor');
            }
            anchors[index] ? anchors[index].parentElement.classList.add('active-anchor') : null;
        }

        changeLinkState();
        window.addEventListener('scroll', changeLinkState);
    }

}

window.customElements.define('contents-component', ContentsComponent);