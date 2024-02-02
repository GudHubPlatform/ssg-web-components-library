import html from './contents.html';
import './contents.scss';

class ContentsComponent extends GHComponent {
    
    constructor() {
        super();
    }

    async onServerRender() {

        this.headings = JSON.parse(this.getAttribute('data-headings'));
        this.newHeadings = [];
        const fullUrl = new URL('http://website.com' + window.location.search);
        const url = fullUrl.searchParams.get('path');
        for (let h in this.headings) {
            let div = document.createElement('div');
            div.innerHTML = this.headings[h].text;
            let text = div.querySelector('a') ? div.querySelector('a').innerText : this.headings[h].text;
            let iterationH = {
                "text": text,
                "level": this.headings[h].level,
                "link": `${url}#${text.toLowerCase().replace(/[^\w\s]/g, '-').replace(/ /g, '-').replace(/-$/, '').replace(/^-/, '')}`,
            };
            this.newHeadings.push(iterationH)
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