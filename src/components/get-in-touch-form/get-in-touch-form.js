import html from './get-in-touch-form.html';
import './get-in-touch-form.scss';

import defaultConfigs from './get-in-touch-form-data.json';
import { checkInputsValidations } from './inputsValidation.js';

let recaptchaPromise = null;

function loadRecaptcha(siteKey) {
    if (!siteKey) return Promise.resolve(null);

    if (window.grecaptcha) return Promise.resolve(window.grecaptcha);

    if (recaptchaPromise) return recaptchaPromise;

    recaptchaPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.grecaptcha) resolve(window.grecaptcha);
            else reject('grecaptcha not available');
        };

        script.onerror = reject;

        document.head.appendChild(script);
    });

    return recaptchaPromise;
}

class GetInTouchForm extends GHComponent {
    constructor() {
        super();

        this.formId = this.getAttribute("data-form-id");
        this.defaultConfigs = defaultConfigs;

        this.generateInput = this.generateInput;
        this.isFormSubmitted = false;
        
        this.placement = 'main';
        this.config = window.getConfig()?.componentsConfigs?.formConfig || window.getConfig()?.formConfig;

        this.recaptcha_site_key = this.hasAttribute('data-recaptcha-site-key')
            ? this.getAttribute('data-recaptcha-site-key')
            : null;
    }

    onServerRender() {
        if (this.hasAttribute('data-in-popup')) return;

        this.initConfig(this.config);
        super.render(html);
    }

    onClientReady() {
        if (!this.hasAttribute('data-in-popup')) {
            this.initConfig(this.config);
            this.attachEventListeners();

            if (this.recaptcha_site_key) {
                loadRecaptcha(this.recaptcha_site_key).catch(console.error);
            }
        }
    }

    clientRender() {
        this.initConfig(this.config);
        super.render(html);
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.getElementsByTagName('form')[0]
            .addEventListener('submit', (e) => this.handleSubmit(e));

        this.getElementsByClassName('restart_button')[0]
            .addEventListener('click', () => this.hideFail());
    }

    onParentPopupClose() {
        if (this.isFormSubmitted) {
            setTimeout(() => {
                this.hideSuccess();
                this.hideFail();
            }, 500);
        }
    }

    initConfig(formConfigs) {
        try {
            this.config = formConfigs.find(({ id }) => id === this.formId);
            if (!this.config) throw new Error("Config not found");
        } catch {
            const defaultId = this.isInPopup ? 'default popup' : 'default';
            this.config = defaultConfigs.find(({ id }) => id === defaultId);
        }

        this.titleName = this.getAttribute('data-form-title') || this.config.title;
        this.subtitleName = this.getAttribute('data-form-subtitle') || this.config.subtitle;
        this.placement = this.getAttribute('data-form-placement') || "main";
        this.buttonText = this.getAttribute('data-form-button-text') || this.config.button_text;
    }

    async getRecaptchaToken(action = 'submit') {
        if (!this.recaptcha_site_key) return null;

        const grecaptcha = await loadRecaptcha(this.recaptcha_site_key);

        return new Promise((resolve, reject) => {
            grecaptcha.ready(() => {
                grecaptcha.execute(this.recaptcha_site_key, { action })
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;

        const validationResults = await this.inputsValidation(form);

        if (validationResults.every(({ isValid }) => isValid)) {
            this.addLoader();

            try {
                const token = await this.getRecaptchaToken();

                await this.fetchExample(token);

                this.handleSuccessFormValidation(form, token);

            } catch (error) {
                console.error(error);
                this.showFail();
            }

            this.removeLoader();

        } else {
            validationResults
                .filter(item => typeof item === 'object')
                .forEach(({ input, isValid }) => this.toggleError(input, isValid));
        }
    }

    handleSuccessFormValidation = (form, token) => {
        const emailInput = form.querySelector('[name="email"]');
        const phoneInput = form.querySelector('[name="phone"]');

        this.showSuccess({
            email: emailInput?.value || '',
            phone: phoneInput?.value || ''
        });

        const formDataObj = this.createDataObject(form, this.placement, token);

        window.dispatchEvent(new CustomEvent('submitForm', { detail: { formDataObj } }));

        this.isFormSubmitted = true;
        this.removeLoader();
    };

    inputsValidation = async (form) => {
        const inputs = Array.from(form.querySelectorAll('input'));
        return checkInputsValidations(inputs);
    }

    fetchExample = (recaptchaToken) => {
        const isSuccess = true;

        return new Promise((resolve, reject) => {
            console.log('reCAPTCHA token:', recaptchaToken);

            setTimeout(() => {
                isSuccess ? resolve() : reject();
            }, 2000);
        });
    }

    createDataObject(form, placement, recaptchaToken) {
        const inputs = {};

        for (const [name, value] of new FormData(form).entries()) {
            inputs[name] = value;
        }

        const { id, mailConfig } = this.config;

        return {
            inputs,
            mailConfig,
            website: window.location.hostname,
            url: window.location.pathname,
            formId: id,
            formPlacement: placement,
            referrer: localStorage.getItem('referrer'),
            recaptchaToken
        };
    }

    toggleError(input, isValid) {
        input.classList[isValid ? 'remove' : 'add']('error');
        input.parentElement.classList[isValid ? 'remove' : 'add']('error-input');
    }

    addLoader() {
        this.classList.add('loading');
        this.querySelector('button[type="submit"]').disabled = true;
    }

    removeLoader() {
        this.classList.remove('loading');
        const btn = this.querySelector('button[type="submit"]');
        setTimeout(() => btn.disabled = false, 500);
    }

    showSuccess({email, phone}) {
        if (email) {
            this.querySelector('.check_entity').classList.add('provided');
            this.getElementsByClassName('email')[0].innerText = email;
        }

        if (phone) {
            this.querySelector('.phone_entity').classList.add('provided');
            this.getElementsByClassName('phone')[0].innerText = phone;
        }

        this.classList.add('success');
    }

    showFail() {
        this.classList.add('fail');
    }

    hideSuccess() {
        this.getElementsByClassName('email')[0].innerText = '';
        this.getElementsByClassName('phone')[0].innerText = '';
        this.querySelector('.phone_entity').classList.remove('provided');
        this.classList.remove('success');
    }

    hideFail() {
        const el = this.querySelector('.overflow.fail');
        el.style.opacity = 0;

        setTimeout(() => {
            this.classList.remove('fail');
            el.style.opacity = '';
        }, 500);
    }

    generateInput(config) {
        return config.inputs.reduce((acc, input) => {
            const maxSymbols = {
                short: 64,
                long: 128,
                phone: 20,
                email: 256
            };

            const tag = input.type === 'textarea' ? 'textarea' : 'input';
            const maxLength = tag === 'textarea' ? maxSymbols.long : maxSymbols[input.type];

            return acc + `
                <div class="input-wrap col-${input.width}">
                    ${input.title ? `<label for="${input.name}">${input.title}</label>` : ''}
                    <${tag} name="${input.name}"
                        ${input.placeholder ? `placeholder="${input.placeholder}"` : ''}
                        ${JSON.parse(input.required) ? 'required' : ''}
                        ${maxLength ? `maxlength="${maxLength}"` : ''}>
                    </${tag}>
                    ${input.type === 'email' || input.type === 'phone' ? `<span class="${input.type}-error">${input.errorText}</span>` : ''}
                </div>
            `;
        }, '');
    }
}

if (!customElements.get('get-in-touch-form')) {
    customElements.define('get-in-touch-form', GetInTouchForm);
}
