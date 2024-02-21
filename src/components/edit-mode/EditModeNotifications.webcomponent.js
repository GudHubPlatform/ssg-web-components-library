import './edit-mode-notifications.scss';

export class EditModeNotifications extends HTMLElement {
    constructor() {
        super();
        this.initListener();
    }
    
    initListener() {
        const self = this;
        window.addEventListener('add-edit-mode-notification', e => {
            const text = e.detail.text;
            const id = 'gh' + new Date().getTime().toString(36);

            const notification = document.createElement('div');
            notification.classList.add('notification');
            notification.innerText = text;
            notification.id = id;

            self.append(notification);

            setTimeout(() => {
                self.querySelector(`#${id}`).remove();
            }, 5000);
        });
    }

}