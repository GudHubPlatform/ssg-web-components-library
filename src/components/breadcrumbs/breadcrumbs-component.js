import html from './breadcrumbs.html';
import './breadcrumbs.scss';

class BreadcrumbsComponent extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        if (this.hasAttribute('data-items')) {
            //manual mode when you passing items in JSON format through attribute "data-items"
            try {
                this.items = JSON.parse(this.getAttribute('data-items'));
            } catch (error) {
                console.error(error);
            }
        }
        else {
            this.breadcrumbsConfig = window.getConfig().componentsConfigs.breadcrumbsConfig;
            this.initialRoute = this.breadcrumbsConfig[0].routesTree;

            let currentUrl = new URL(window.location.href);
            currentUrl = currentUrl.searchParams.get('path');
        }

        this.items === null ? console.error(`Didn't find current route in config, current URL: ${currentUrl}`) : null;

        if (this.items) {
            super.render(html);
        }
    }

    onClientReady() {
        if (!!this.innerHTML) {
            console.error(`Didn't find current route in config`);
        }
    }

    generateBreadcrumbs(route, currentUrl, breadcrumbs = []) {
        if (!!route.image) {
            breadcrumbs.push({ 
                title: route.title, 
                link: route.link, 
                image: route.image 
            });
        } else {
            breadcrumbs.push({ title: route.title, link: route.link });
        }

        if (route.link === currentUrl) {
            if (breadcrumbs.length > 0) {
                const { link, ...lastBreadcrumb } = breadcrumbs.pop();
                breadcrumbs.push(lastBreadcrumb);
            }
            return breadcrumbs;
        }

        if (route.childs) {
            for (const childRoute of (route.childs)) {
                const result = this.generateBreadcrumbs(childRoute, currentUrl, [...breadcrumbs]);
                if (result) {
                    return result;
                }
            }
        }
        
        return null;
    }
}

window.customElements.define('breadcrumbs-component', BreadcrumbsComponent);