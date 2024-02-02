import html from './about-us-team-members.html';
import './about-us-team-members.scss';
import jsonTemplate from './about-us-team-members-data.json';

class AboutUsTeamMembers extends GHComponent {

    constructor() {
        super();
        super.setDefaultData(jsonTemplate);
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;

        this.json = await super.getGhData(this.ghId);

        super.render(html);
    }

}

window.customElements.define('about-us-team-members', AboutUsTeamMembers);