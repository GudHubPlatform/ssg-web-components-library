import html from './get-in-touch-form.html';
import './get-in-touch-form.scss';
import defaultConfigs from './get-in-touch-form-data.json';
import { validationCallbacks } from './validationCallbacks.js';

class GetInTouchForm extends GHComponent {

    constructor() {
        super();
        this.formId = this.getAttribute("data-form-id");
        this.defaultConfigs = defaultConfigs;

        this.generateInput = this.generateInput;
        this.isFormSubmitted = false;
        
        this.placement = 'main';
        this.config = window.getConfig().componentsConfigs.formConfig;
    }

    onServerRender() {
        if (this.hasAttribute('data-in-popup')) {
            return;
        }

        this.initConfig(this.config);
        super.render(html);
    }

    onClientReady() {
        if (!this.hasAttribute('data-in-popup')) {
            this.initConfig(this.config);
            this.attachEventListeners();
        }
    }

    clientRender() {
        this.initConfig(this.config);
        super.render(html);
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.getElementsByTagName('form')[0].addEventListener('submit', (e) => this.handleSubmit(e));
        this.getElementsByClassName('restart_button')[0].addEventListener('click', (e) => this.hideFail());
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
            if (!this.config) {
                throw new Error("Config not found");
            }
        } catch (error) {
            const defaultId = this.isInPopup ? 'default popup' : 'default';
            this.config = defaultConfigs.find(({ id }) => id === defaultId);
        }

        this.titleName = this.hasAttribute('data-form-title') ? this.getAttribute('data-form-title') : this.config.title;
        this.subtitleName = this.hasAttribute('data-form-subtitle') ? this.getAttribute('data-form-subtitle') : this.config.subtitle;
        this.placement = this.hasAttribute('data-form-placement') ? this.getAttribute('data-form-placement') : "main";
        this.buttonText = this.hasAttribute('data-form-button-text') ? this.getAttribute('data-form-button-text') : this.config.button_text;
    };

    checkInputsValidations = (inputs) => {
        const result = inputs.map((input) => {
            const validationCallback = validationCallbacks[input.name];
            if (!validationCallback) return {
                input,
                isValid: true
            };

            return {
                input,
                isValid: validationCallback(input)
            };
        });

        return result;
    };

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
    
        const inputs = Array.from(form.querySelectorAll('input'));
        const emailInput = this.querySelector('[name="email"]');
        const phoneInput = this.querySelector('[name="phone"]');

        const validationResults = this.checkInputsValidations(inputs);

        if (validationResults.every((res) => res.isValid)) {
            this.addLoader();
            try {
                const res = await new Promise((resolve, reject) => {
                    const TIMEOUT_DURATION = 2000;
    
                    setTimeout(() => {
                        const isSuccess = true; 
                        if (isSuccess) {
                            resolve(true);
                        } else {
                            reject(new Error('Failed to send email'));
                        }
                    }, TIMEOUT_DURATION);
                });
    
                this.removeLoader(form);
    
                if (res) {
                    this.showSuccess({ email: emailInput ? emailInput.value : '', phone: phoneInput ? phoneInput.value : '' });
                } else {
                    this.showFail();
                }
            } catch (error) {
                this.removeLoader(form);
                this.showFail();
            }
            this.isFormSubmitted = true;
        } else {
            const validationResultsForErrors = validationResults.filter(item => typeof item === 'object')
            validationResultsForErrors.forEach(({ input, isValid }) => this.toggleError(input, isValid));
        }

        this.createDataObject(form, this.config, this.placement)
    }
    
    async createDataObject(form, formId, placement) {
        const formData = {};
        for (const [name, value] of (new FormData(form)).entries()) {
            formData[name] = value;
        }

        const formDataObj = {
            Website: window.location.hostname,
            Url: window.location.pathname,
            FormId: formId,
            FormPlacement: placement,
            FormData: {
                ...formData
            },
            Referrer: localStorage.getItem('referrer'),
        };

        window.dispatchEvent(new CustomEvent('submitForm', { detail: { formDataObj } }));
    }
    toggleError(input, isValid) {
        input.classList[isValid ? 'remove' : 'add']('error');
        input.parentElement.classList[isValid ? 'remove' : 'add']('error-input');
    }
    async addLoader() {
        this.classList.add('loading');
        this.querySelector('button[type="submit"]').disabled = true;
    }
    async removeLoader() {
        this.classList.remove('loading');
        const submitButton = this.querySelector('button[type="submit"]');
        setTimeout(() => {
            submitButton.disabled = false;
        }, 500);
    }
    async showSuccess({email, phone}) {
        if (email) {
            this.querySelector('.check_entity').classList.add('provided');
            this.getElementsByClassName('email')[0].innerText = email;
        }
        this.classList.add('success');
        if (phone) {
            this.querySelector('.check_entity.phone_entity').classList.add('provided');
            this.getElementsByClassName('phone')[0].innerText = phone;
        }
        this.classList.add('success');
    }
    async showFail() {
        this.classList.add('fail');
    }
    async hideSuccess() {
        this.getElementsByClassName('email')[0].innerText = '';
        this.getElementsByClassName('phone')[0].innerText = '';
        this.querySelector('.check_entity.phone_entity').classList.remove('provided');
        this.classList.remove('success');
    }
    async hideFail() {
        const overflowFail = this.querySelector('.overflow.fail');
        overflowFail.style.opacity = 0;
        setTimeout(() => {
            this.classList.remove('fail');
            overflowFail.style.opacity = '';
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
                    <${tag} type="text" name=${input.name} placeholder="${input.placeholder}" ${JSON.parse(input.required) ? 'required' : ''} ${maxLength ? `maxlength=${maxLength}` : ''}></${tag}>
                    ${input.type === 'email' || input.type === 'phone' ? `<span class="${input.type}-error">${input.errorText}</span>` : ''}
                </div>
            `;
        }, '');
    }
}

if (!customElements.get('get-in-touch-form')) {
    customElements.define('get-in-touch-form', GetInTouchForm);
}