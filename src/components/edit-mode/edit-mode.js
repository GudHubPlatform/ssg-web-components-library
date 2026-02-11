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

        this._arrayControlsCleanup = null;
        this._ghIdClickCleanup = null;
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

        if (this.editModeActive === true && this.notificationComponentRendered === false) {
            this.renderNotificationsComponent();
        }

        if (this.editModeActive) {
            this.initEditors();
        } else {
            this.disableEditors();
        }
    }

    disableEditors() {
        if (this._arrayControlsCleanup) {
            this._arrayControlsCleanup();
            this._arrayControlsCleanup = null;
        }

        if (this._ghIdClickCleanup) {
            this._ghIdClickCleanup();
            this._ghIdClickCleanup = null;
        }

        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('edit-mode-enabled');

        const elementsToEdit = document.querySelectorAll('[gh-id]');
        if (elementsToEdit.length) {
            elementsToEdit.forEach(element => {
                if (element.classList.contains('mce-content-body')) {
                    tinymce.get(element.id).destroy();
                }
                element.replaceWith(element.cloneNode(true));
            });
        }
    }

    initEditors() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('edit-mode-enabled');

        const showLoginPopup = () => this.showLoginPopup();
        const initGudHub = (auth_key) => this.initGudHub(auth_key);

        if (!document.querySelector('script[id="tinymce_script"]')) {
            const script = document.createElement('script');
            script.setAttribute('src', 'https://cdn.tiny.cloud/1/ts08yt1lknwldsqs5d4iohomcmpfd2wolmcy7lao74r3ita3/tinymce/6/tinymce.min.js');
            script.setAttribute('referrerpolicy', 'origin');
            script.setAttribute('id', 'tinymce_script');
            document.querySelector('head').appendChild(script);
        }

        if (!this._arrayControlsCleanup) {
            this._arrayControlsCleanup = initArrayItemControls();
        }

        if (!this._ghIdClickCleanup) {
            this._ghIdClickCleanup = initGhIdClickDelegation();
        }

        return Promise.resolve();

        function initTinyMce(element, parentGhComponent) {
            const self = parentGhComponent;

            tinymce.init({
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
                    });

                    editor.on('remove', () => {
                        element.classList.remove('gh-id-editing');
                    });

                    editor.ui.registry.addButton('saveButton', {
                        text: 'Save',
                        onAction: async (_) => {
                            if (isUndefined(window.gudhub)) {
                                if (window.localStorage.getItem('gudhub_auth_key')) {
                                    initGudHub(window.localStorage.getItem('gudhub_auth_key'));
                                } else {
                                    showLoginPopup();
                                    return;
                                }
                            }

                            let ids = await self.findIds();
                            const currentChapter = window?.constants?.currentChapter || 'pages';

                            const data = await gudhub.getDocument({
                                app_id: ids.appId,
                                item_id: ids.itemId,
                                element_id: document.querySelector('html').getAttribute(`data-${currentChapter}-json_field_id`)
                            });

                            const json = JSON.parse(data.data);

                            const content = editor.getContent();
                            const ghId = element.getAttribute('gh-id');

                            if (ghId.indexOf('.') === -1) {
                                json[ghId] = content;
                            } else {
                                const findedJson = self.findValueByPath(json, ghId.substring(0, ghId.lastIndexOf('.')));
                                findedJson[ghId.substring(ghId.lastIndexOf('.') + 1, ghId.length)] = content;
                            }

                            await gudhub.createDocument({
                                app_id: ids.appId,
                                item_id: ids.itemId,
                                element_id: document.querySelector('html').getAttribute(`data-${currentChapter}-json_field_id`),
                                data: JSON.stringify(json)
                            });

                            window.dispatchEvent(new CustomEvent('add-edit-mode-notification', {
                                detail: { text: 'Saved' }
                            }));
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
                        onAction: function () {
                            if (!window.location.href.includes('mode=ssr')) {
                                const url = new URL(window.location.href);
                                url.searchParams.append('mode', 'ssr');
                                window.location.href = url.toString();
                            } else {
                                window.location.reload();
                            }
                        }
                    });

                    editor.ui.registry.addButton('accentColor', {
                        text: 'Color',
                        onAction: function () {
                            editor.formatter.toggle('accentColor');
                        }
                    });

                    editor.ui.registry.addButton('accentBackground', {
                        text: 'Background',
                        onAction: function () {
                            editor.formatter.toggle('accentBackground');
                        }
                    });
                }
            });
        }

        function initGhIdClickDelegation() {
            const onClick = (e) => {
                const element = e.target?.closest?.('[gh-id]');
                const isTinyUI = e.target?.closest?.('.tox, .tox-toolbar, .tox-editor-container');
                const isArrayPanel = e.target?.closest?.('#gh-array-panel');

                if (!element && !isTinyUI && !isArrayPanel) {
                    document.querySelectorAll('.gh-id-editing').forEach(el => {
                        el.classList.remove('gh-id-editing');

                        if (el.classList.contains('mce-content-body')) {
                            const ed = tinymce.get(el.id);
                            if (ed) ed.destroy();
                        }
                    });
                    return;
                }

                if (!element) return;

                if (isUndefined(tinymce)) {
                    alert('TinyMCE not ready yet');
                    return;
                }

                if (element.getAttribute('contenteditable') == 'true') return;

                const parentGhComponent = (() => {
                    let parentElement = element;
                    while (parentElement) {
                        if (parentElement.tagName && parentElement.tagName.includes('-') && typeof parentElement.findIds === 'function') {
                            return parentElement;
                        }
                        parentElement = parentElement.parentElement;
                    }
                    return null;
                })();

                if (!parentGhComponent) return;

                const panel = document.querySelector('#gh-array-panel');
                if (panel) {
                    panel.style.display = 'none';
                    panel.setAttribute('aria-hidden', 'true');
                }

                document
                    .querySelectorAll('.gh-id-editing')
                    .forEach(el => el.classList.remove('gh-id-editing'));

                element.classList.add('gh-id-editing');
                initTinyMce(element, parentGhComponent);
            };

            document.addEventListener('click', onClick, true);

            return () => document.removeEventListener('click', onClick, true);
        }

        function initArrayItemControls({ root = document } = {}) {
            function stopEvent(event) {
                event.preventDefault();
                event.stopPropagation();
            }

            function deepClone(value) {
                try { return structuredClone(value); }
                catch { return JSON.parse(JSON.stringify(value)); }
            }

            function getValueByPath(object, pathArray) {
                let currentValue = object;
                for (const key of pathArray) {
                    if (currentValue == null) return undefined;
                    currentValue = currentValue[key];
                }
                return currentValue;
            }

            function setValueByPath(object, pathArray, value) {
                if (!object || !pathArray?.length) return;

                let current = object;
                for (let i = 0; i < pathArray.length - 1; i++) {
                    const key = pathArray[i];
                    if (current[key] == null) {
                        current[key] = (typeof pathArray[i + 1] === 'number') ? [] : {};
                    }
                    current = current[key];
                }
                current[pathArray[pathArray.length - 1]] = value;
            }

            function parseGhId(ghId) {
                if (!ghId) return null;

                const pathParts = ghId.split('.').map(part =>
                    String(+part) === part ? Number(part) : part
                );

                const numericIndexes = pathParts
                    .map((value, index) =>
                        typeof value === 'number' && Number.isFinite(value) ? index : -1
                    )
                    .filter(index => index !== -1);

                if (!numericIndexes.length) return null;

                const lastIndexPosition = numericIndexes[numericIndexes.length - 1];

                return {
                    fullPath: pathParts,
                    arrayPath: pathParts.slice(0, lastIndexPosition),
                    itemIndexPosition: lastIndexPosition,
                    itemIndex: pathParts[lastIndexPosition],
                };
            }

            let controlPanel = document.querySelector('#gh-array-panel');

            if (!controlPanel) {
                controlPanel = document.createElement('div');
                controlPanel.id = 'gh-array-panel';

                controlPanel.innerHTML = `
                    <button type="button" data-action="add" class="gh-panel-btn">
                        Add
                    </button>
                    <button type="button" data-action="remove" class="gh-panel-btn">
                        Remove
                    </button>
                `;

                document.body.appendChild(controlPanel);
            }

            async function findIdsFromElement(element) {
                let parent = element.parentElement;

                while (parent) {
                    if (
                        parent.tagName &&
                        parent.tagName.includes('-') &&
                        typeof parent.findIds === 'function'
                    ) {
                        return parent.findIds();
                    }
                    parent = parent.parentElement;
                }

                return null;
            }

            function ensureGudhubInitialized() {
                if (window.gudhub) return true;

                const authKey = localStorage.getItem('gudhub_auth_key');
                if (!authKey) {
                    showLoginPopup();
                    return false;
                }

                initGudHub(authKey);
                return true;
            }

            let cachedDocumentKey = null;
            let cachedJson = null;

            async function loadJsonForElement(element) {
                const ids = await findIdsFromElement(element);
                if (!ids) return null;

                const currentChapter = window?.constants?.currentChapter || 'pages';
                const elementId = document.documentElement.getAttribute(`data-${currentChapter}-json_field_id`);

                const cacheKey = `${ids.appId}:${ids.itemId}:${elementId}`;

                if (cacheKey === cachedDocumentKey && cachedJson) {
                    return { ids, elementId, json: cachedJson };
                }

                const response = await gudhub.getDocument({
                    app_id: ids.appId,
                    item_id: ids.itemId,
                    element_id: elementId,
                });

                const parsedJson = JSON.parse(response.data);

                cachedDocumentKey = cacheKey;
                cachedJson = parsedJson;

                return { ids, elementId, json: parsedJson };
            }

            function updateGhIdsIndexInside(rootEl, itemIndexPosition, newIndex) {
                const nodes = rootEl.querySelectorAll('[gh-id]');
                nodes.forEach(node => {
                    const ghId = node.getAttribute('gh-id');
                    if (!ghId) return;

                    const parts = ghId.split('.');
                    if (itemIndexPosition < 0 || itemIndexPosition >= parts.length) return;

                    parts[itemIndexPosition] = String(newIndex);
                    node.setAttribute('gh-id', parts.join('.'));
                });
            }

            function getPathPartsFromGhId(ghId) {
                return ghId.split('.').map(part =>
                    String(+part) === part ? Number(part) : part
                );
            }

            function fillGhIdValuesFromJson(rootEl, json) {
                const nodes = rootEl.querySelectorAll('[gh-id]');
                nodes.forEach(node => {
                    const ghId = node.getAttribute('gh-id');
                    if (!ghId) return;

                    const path = getPathPartsFromGhId(ghId);
                    const value = getValueByPath(json, path);

                    node.innerHTML = value ?? '';
                });
            }

            function getDomValue(node) {
                if (node.id && window.tinymce) {
                    const ed = tinymce.get(node.id);
                    if (ed) return ed.getContent();
                }
                return node.innerHTML;
            }

            function syncDomToJsonForContainer(container, json) {
                const nodes = container.querySelectorAll('[gh-id]');
                nodes.forEach(node => {
                    const ghId = node.getAttribute('gh-id');
                    if (!ghId) return;

                    const path = getPathPartsFromGhId(ghId);
                    setValueByPath(json, path, getDomValue(node));
                });
            }

            function rerenderArrayContainerFromJson({ targetElement, json, arrayPath }) {
                const container = targetElement.closest('[gh-array]');
                if (!container) return false;

                const arr = getValueByPath(json, arrayPath);
                if (!Array.isArray(arr)) return false;

                const itemSelector = container.querySelector('[gh-item]') ? '[gh-item]' : '.item';
                const firstItem = container.querySelector(itemSelector);
                if (!firstItem) return false;

                const template = firstItem.cloneNode(true);

                const anyGh = template.querySelector('[gh-id]');
                const parsed = anyGh ? parseGhId(anyGh.getAttribute('gh-id')) : null;
                const itemIndexPosition = parsed?.itemIndexPosition;
                if (typeof itemIndexPosition !== 'number') return false;

                container.innerHTML = '';

                for (let i = 0; i < arr.length; i++) {
                    const clone = template.cloneNode(true);

                    updateGhIdsIndexInside(clone, itemIndexPosition, i);
                    fillGhIdValuesFromJson(clone, json);

                    container.appendChild(clone);
                }

                return true;
            }

            let currentHover = null;
            let hideTimer = null;

            function scheduleHidePanel() {
                clearTimeout(hideTimer);
                hideTimer = setTimeout(() => hidePanel(), 250);
            }

            function cancelHidePanel() {
                clearTimeout(hideTimer);
                hideTimer = null;
            }

            function hidePanel() {
                controlPanel.style.display = 'none';
                currentHover = null;
                lastHoveredItem = null;

                document.querySelectorAll('.gh-item-hovered').forEach(el => el.classList.remove('gh-item-hovered'));
                controlPanel.setAttribute('aria-hidden', 'true');
            }

            function showPanelOverItem(itemEl) {
                const rect = itemEl.getBoundingClientRect();

                const panelW = 220;
                const panelH = 36;
                const top = Math.max(8, rect.top - panelH - 8);
                const left = Math.max(
                    8,
                    Math.min(window.innerWidth - panelW - 8, rect.left + (rect.width / 2) - (panelW / 2))
                );

                controlPanel.style.top = `${top}px`;
                controlPanel.style.left = `${left}px`;
                controlPanel.style.display = 'flex';

                controlPanel.setAttribute('aria-hidden', 'false');
            }

            function getItemElementFromTarget(target) {
                return target?.closest?.('[gh-array] [gh-item]') || target?.closest?.('[gh-array] .item');
            }

            function getAnyGhIdInsideItem(itemEl) {
                return itemEl?.querySelector?.('[gh-id]') || null;
            }

            let animationFrameId = 0;
            let lastHoveredItem = null;

            function handlePointerMove(event) {
                if (animationFrameId) return;

                animationFrameId = requestAnimationFrame(async () => {
                    animationFrameId = 0;

                    if (controlPanel.contains(event.target)) {
                        cancelHidePanel();
                        return;
                    }

                    const hoveredItem = getItemElementFromTarget(event.target);

                    if (!hoveredItem) {
                        scheduleHidePanel();
                        return;
                    }

                    cancelHidePanel();

                    if (hoveredItem === lastHoveredItem) return;
                    lastHoveredItem = hoveredItem;

                    const anyGh = getAnyGhIdInsideItem(hoveredItem);
                    if (!anyGh) {
                        scheduleHidePanel();
                        return;
                    }

                    const parsedPath = parseGhId(anyGh.getAttribute('gh-id'));
                    if (!parsedPath) {
                        scheduleHidePanel();
                        return;
                    }

                    if (!ensureGudhubInitialized()) {
                        scheduleHidePanel();
                        return;
                    }

                    const loadedData = await loadJsonForElement(anyGh);
                    if (!loadedData) {
                        scheduleHidePanel();
                        return;
                    }

                    const targetArray = getValueByPath(loadedData.json, parsedPath.arrayPath);
                    if (!Array.isArray(targetArray)) {
                        scheduleHidePanel();
                        return;
                    }

                    currentHover = { element: anyGh, itemEl: hoveredItem, meta: parsedPath };

                    document.querySelectorAll('.gh-item-hovered').forEach(el => el.classList.remove('gh-item-hovered'));
                    hoveredItem.classList.add('gh-item-hovered');

                    showPanelOverItem(hoveredItem);
                });
            }


            controlPanel.addEventListener('pointerdown', stopEvent, true);
            controlPanel.addEventListener('pointerenter', () => {
                cancelHidePanel();
            }, true);

            controlPanel.addEventListener('pointerleave', () => {
                scheduleHidePanel();
            }, true);


            controlPanel.addEventListener('click', async event => {
                stopEvent(event);

                const button = event.target.closest('button[data-action]');
                if (!button || !currentHover) return;

                if (!ensureGudhubInitialized()) return;

                const actionType = button.getAttribute('data-action');

                const loadedData = await loadJsonForElement(currentHover.element);
                if (!loadedData) return;

                const { ids, elementId, json } = loadedData;

                const container = currentHover.itemEl?.closest?.('[gh-array]') || currentHover.element.closest('[gh-array]');
                if (container) {
                    syncDomToJsonForContainer(container, json);
                }

                const targetArray = getValueByPath(json, currentHover.meta.arrayPath);
                if (!Array.isArray(targetArray)) return;

                const itemIndex = currentHover.meta.itemIndex;

                if (actionType === 'add') {
                    targetArray.splice(itemIndex + 1, 0, deepClone(targetArray[itemIndex] ?? {}));
                }

                if (actionType === 'remove') {
                    if (targetArray.length <= 1) return;
                    targetArray.splice(itemIndex, 1);
                }

                await gudhub.createDocument({
                    app_id: ids.appId,
                    item_id: ids.itemId,
                    element_id: elementId,
                    data: JSON.stringify(json),
                });

                cachedJson = json;

                rerenderArrayContainerFromJson({
                    targetElement: currentHover.element,
                    json,
                    arrayPath: currentHover.meta.arrayPath,
                });

                lastHoveredItem = null;
                hidePanel();
            }, true);

            root.addEventListener('pointermove', handlePointerMove, true);
            window.addEventListener('scroll', scheduleHidePanel, true);
            window.addEventListener('resize', scheduleHidePanel, true);

            return () => {
                root.removeEventListener('pointermove', handlePointerMove, true);
                window.removeEventListener('scroll', scheduleHidePanel, true);
                window.removeEventListener('resize', scheduleHidePanel, true);
                hidePanel();
            };

        }
    }

    renderNotificationsComponent() {
        if (!window.customElements.get('edit-mode-notifications')) {
            window.customElements.define('edit-mode-notifications', EditModeNotifications);
        }

        if (!document.querySelector('edit-mode-notifications')) {
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
            if (e.target === document.querySelector('.gudhub-login-popup__bg')) {
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
        } catch (err) {
            console.error('GHCOMPONENT ERROR: you need to import GudHub library (@gudhub/core) before using GHComponent!');
        }

        window.gudhub = !isUndefined(window.gudhub)
            ? window.gudhub
            : new GudHub(isUndefined(auth_key) ? window.getConfig().auth_key : auth_key, {
                server_url: 'https://app.gudhub.com/GudHub',
                file_server_url: 'https://app.gudhub.com',
                async_modules_path: 'build/latest/async_modules/',
            });

        this.hideLoginPopup();
    }

    connectLoginScript() {
        if (!document.querySelector('script#gudhub_login_component')) {
            const script = document.createElement('script');
            script.id = 'gudhub-login-component';
            script.src = 'https://unpkg.com/@gudhub/gh-login/index.js';

            document.body.append(script);
        }
    }

    createLoginPopup() {
        if (!document.querySelector('#gudhub_login_popup')) {
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
        this.connectLoginScript();
        this.createLoginPopup();
        document.querySelector('.gudhub-login-popup__bg').classList.add('active');
        this.initListeners();
    }

    hideLoginPopup() {
        if (document.querySelector('.gudhub-login-popup__bg')) {
            document.querySelector('.gudhub-login-popup__bg').classList.remove('active');
        }
    }
}

if (!window.customElements.get('edit-mode')) {
    window.customElements.define('edit-mode', EditMode);
}
