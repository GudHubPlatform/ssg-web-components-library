import html from './breadcrumbs.html';
import './breadcrumbs.scss';

class BreadcrumbsComponent extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        let currentUrl = new URL(window.location.href);
        currentUrl = currentUrl.searchParams.get('path');

        this.breadcrumbsConfig = window.getConfig().componentsConfigs.breadcrumbsConfig;
        this.initialRoute = this.breadcrumbsConfig[0].routesTree;

        this.items = this.generateBreadcrumbs(this.initialRoute, currentUrl);

        super.render(html);
    }

    generateBreadcrumbs(route, currentUrl, breadcrumbs = []) {
        if (route.image !== undefined) {
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
                const response = this.generateBreadcrumbs(childRoute, currentUrl, [...breadcrumbs]);
                if (response) {
                    return response;
                }
            }
        }

        return null;
    }
}

window.customElements.define('breadcrumbs-component', BreadcrumbsComponent);