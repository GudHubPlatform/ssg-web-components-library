import html from './tabs.html';
import './tabs.scss';

class TabsComponent extends GHComponent {
    /**
     * data-icons="false" - if no icons in headings of tabs
     * class="text-align-left"
     */
    constructor() {
        super();
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        
        const json = await super.getGhData(this.ghId);

        this.tabs = json.tabs;        

        super.render(html);
    }

    openTab(tab) {
        let tabs = this.querySelectorAll('.tab_header');
        let tabTarget = tab.querySelector('.tab_header')
        if (window.innerWidth < 800) {
            if (tabTarget.classList.contains('active')) {
                tabTarget.classList.remove('active');
            } else {
                this.toggleClasses(tabs, tabTarget);
            }
        } else {
            this.toggleClasses(tabs, tabTarget);
        }
    }

    toggleClasses(tabs, tabTarget) {
        tabs.forEach(element => {
            element.classList.remove('active');
        });
        tabTarget.classList.add('active');
    }
}

window.customElements.define('tabs-component', TabsComponent);