import html from './edit-mode.html';
import './edit-mode.scss';

class EditMode extends GHComponent {
    constructor() {
        super();
    }

    onServerRender() {
        super.render(html);
    }

    toggleEditMode() {
        const event = new Event('toggle-edit-mode');
        window.dispatchEvent(event);
        document.querySelector('body').classList.toggle('edit-mode-enabled');
    }

}

if(!window.customElements.get('edit-mode')) {
    window.customElements.define('edit-mode', EditMode);
}