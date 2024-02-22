import html from './edit-mode.html';
import './edit-mode.scss';

import './gudhub-login-popup.scss';

import { EditModeNotifications } from './EditModeNotifications.webcomponent.js';

import { isUndefined } from './Helpers.js';

class EditMode extends GHComponent {
    constructor() {
        super();

        this.notificationComponentRendered = false;
        this.editModeActive = false;
    }

    onServerRender() {
        super.render(html);
    }

    toggleEditMode() {
        if (!document.querySelector('script#gudhub-library')) {
            let gudhubLibraryScript = document.createElement('script');
            gudhubLibraryScript.id = 'gudhub-library';
            gudhubLibraryScript.setAttribute('src', 'https://unpkg.com/@gudhub/core/umd/library.min.js');
            document.body.append(gudhubLibraryScript);
        }
        this.editModeActive = !this.editModeActive;

        if(this.editModeActive === true && this.notificationComponentRendered === false) {
            this.renderNotificationsComponent();
        }

        if(this.editModeActive) {
            this.initEditors();
        } else {
            this.disableEditors();
        }
    }

    disableEditors() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('edit-mode-enabled');
        const elementsToEdit = document.querySelectorAll('[gh-id]');
        if(elementsToEdit.length) {
            elementsToEdit.forEach(element => {
                if(element.classList.contains('mce-content-body')) {
                    tinymce.get(element.id).destroy();
                }
                element.replaceWith(element.cloneNode(true));
            })
        }
    }

    initEditors() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('edit-mode-enabled');
        const showLoginPopup = () => this.showLoginPopup();
        const initGudHub = (auth_key) => this.initGudHub(auth_key);
        if(!document.querySelector('script[id="tinymce_script"]')) {
            const script = document.createElement('script');

            script.setAttribute('src', 'https://cdn.tiny.cloud/1/ts08yt1lknwldsqs5d4iohomcmpfd2wolmcy7lao74r3ita3/tinymce/6/tinymce.min.js');
            script.setAttribute('referrerpolicy', 'origin');
            script.setAttribute('id', 'tinymce_script');

            document.querySelector('head').appendChild(script);
        }

        return new Promise(async (resolve) => {
            const elementsToEdit = document.querySelectorAll('[gh-id]');
            if(elementsToEdit.length) {
                    elementsToEdit.forEach(element => {
                        element.addEventListener('click', e => {
                            if(isUndefined(tinymce)) {
                                alert('TinyMCE not ready yet')
                            } else if(element.getAttribute('contenteditable') != true) {
                                const parentGhComponent = (() => {
                                    let parentElement = element.parentElement;
                                    while (parentElement) {
                                        if (parentElement.tagName.includes('-')) {
                                            return parentElement;
                                        }
                                        parentElement = parentElement.parentElement;
                                    }

                                    return null;
                                })()
                                initTinyMce(element, parentGhComponent);
                            }
                        });
                    })
            }
            resolve();
        });

        function initTinyMce(element, parentGhComponent) {
            const self = parentGhComponent;
            let editorInstance = tinymce.init({
                target: element,
                plugins: 'advlist autolink lists link image charmap preview anchor pagebreak',
                toolbar_mode: 'floating',
                toolbar: 'link | bold italic accentColor accentBackground | undo redo | saveButton cancelButton cacheButton',
                menubar: false,
                inline: true,
                formats: {
                    accentColor: { inline: 'span', classes: 'accent-color' },
                    accentBackground: { inline: 'span', classes: 'accent-background' }
                },
                auto_focus: element.id,
                setup: (editor) => {
                    editor.on('init', e => {
                        e.target.focus();
                    })
                    editor.ui.registry.addButton('saveButton', {
                        text: 'Save',
                        onAction: async (_) => {
                            if(isUndefined(window.gudhub)) {
                                if(window.localStorage.getItem('gudhub_auth_key')) {
                                    initGudHub(window.localStorage.getItem('gudhub_auth_key'));
                                } else {
                                    showLoginPopup();
                                    return;
                                }
                            }
                            let ids = await self.findIds();

                            let currentChapter;
                            if (document.querySelector('html').hasAttribute('data-current-chapter')) {
                                currentChapter = document.querySelector('html').getAttribute('data-current-chapter');
                            } else {
                                currentChapter = 'pages';
                            }

                            const data = await gudhub.getDocument({app_id: ids.appId, item_id: ids.itemId, element_id: document.querySelector('html').getAttribute(`data-${currentChapter}-json_field_id`)});
                            const json = JSON.parse(data.data);
                            const content = editor.getContent();
                            const ghId = element.getAttribute('gh-id');
                            if(ghId.indexOf('.') === -1) {
                                json[ghId] = content;
                            } else {
                                const findedJson = self.findValueByPath(json, ghId.substring(0, ghId.lastIndexOf('.')));
                                findedJson[ghId.substring(ghId.lastIndexOf('.') + 1, ghId.length)] = content;
                            }
                            await gudhub.createDocument({app_id: ids.appId, item_id: ids.itemId, element_id: document.querySelector('html').getAttribute(`data-${currentChapter}-json_field_id`), data: JSON.stringify(json) });

                            window.dispatchEvent(new CustomEvent('add-edit-mode-notification', {
                                detail: {
                                    text: 'Saved'
                                }
                            }))
                        }
                    });

                    editor.ui.registry.addButton('cancelButton', {
                        text: 'Cancel',
                        onAction: function (_) {
                            editor.resetContent();
                        }
                    });

                    editor.ui.registry.addButton('cacheButton', {
                        text: 'Update cache',
                        onAction: function() {
                            window.location.href = window.location.href + '?mode=ssr'
                        }
                    });

                    editor.ui.registry.addButton('accentColor', {
                        text: 'Color',
                        onAction: function() {
                            editor.formatter.toggle('accentColor');
                        }
                    });

                    editor.ui.registry.addButton('accentBackground', {
                        text: 'Background',
                        onAction: function() {
                            editor.formatter.toggle('accentBackground');
                        }
                    });
                }
              });
        }
    }

    renderNotificationsComponent() {
        if(!window.customElements.get('edit-mode-notifications')) {
            window.customElements.define('edit-mode-notifications', EditModeNotifications);
        }

        if(!document.querySelector('edit-mode-notifications')) {
            document.body.append(document.createElement('edit-mode-notifications'));
        }
    }

    initListeners() {
        const listener = (e) => {
           this.initGudHub(e.detail.data.auth_key);
           window.localStorage.setItem('gudhub_auth_key', e.detail.data.auth_key);
           window.removeEventListener('gudhub-login', listener, false);
        }
        window.addEventListener('gudhub-login', listener, false);

        const outsideClickListener = (e) => {
            if(e.target === document.querySelector('.gudhub-login-popup__bg')) {
                this.hideLoginPopup();
                window.removeEventListener('click', outsideClickListener, false);
            }
        }

        window.addEventListener('click', outsideClickListener, false);
    }

    initGudHub(auth_key) {
        let GudHub;
        try {
            GudHub = !isUndefined(GudHubLibrary) ? GudHubLibrary.GudHub : GudHub;
        } catch(err) {
            console.error('GHCOMPONENT ERROR: you need to import GudHub library (@gudhub/core) before using GHComponent!');
        }

        window.gudhub = !isUndefined(window.gudhub) ? window.gudhub : new GudHub(isUndefined(auth_key) ? window.constants.auth_key : auth_key, {
            server_url: 'https://gudhub.com/GudHub_Test',
            file_server_url: 'https://gudhub.com',
            async_modules_path: 'build/latest/async_modules/',
        });

        this.hideLoginPopup();
    }

    checkGudhub() {
        return !isUndefined(window.gudhub);
    }

    connectLoginSript() {
        if(!document.querySelector('script#gudhub_login_component')) {
            const script = document.createElement('script');
            script.id = 'gudhub-login-component';
            script.src = 'https://unpkg.com/@gudhub/gh-login/index.js';

            document.body.append(script);
        }
    }

    createLoginPopup() {
        if(!document.querySelector('#gudhub_login_popup')) {
            const div = document.createElement('div');
            div.classList.add('gudhub-login-popup__bg');
            div.id = 'gudhub_login_popup';

            const component = document.createElement('gudhub-login');
            component.setAttribute('mode', 'login');
            component.setAttribute('action', 'event');

            div.append(component);

            document.body.append(div);
        }
    }

    showLoginPopup() {
        this.connectLoginSript();
        this.createLoginPopup();
        document.querySelector('.gudhub-login-popup__bg').classList.add('active');
        this.initListeners();
    }

    hideLoginPopup() {
        if(document.querySelector('.gudhub-login-popup__bg')) {
            document.querySelector('.gudhub-login-popup__bg').classList.remove('active');
        }
    }

}

if(!window.customElements.get('edit-mode')) {
    window.customElements.define('edit-mode', EditMode);
}