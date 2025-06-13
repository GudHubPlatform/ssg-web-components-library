import html from './get-in-touch-form.html';
import './get-in-touch-form.scss';
import defaultConfigs from './get-in-touch-form-data.json';
import { checkInputsValidations } from './inputsValidation.js';

class GetInTouchForm extends GHComponent {

    constructor() {
        super();
        this.formId = this.getAttribute("data-form-id");
        this.defaultConfigs = defaultConfigs;

        this.generateInput = this.generateInput;
        this.isFormSubmitted = false;
        
        this.placement = 'main';
        this.config = window.getConfig()?.componentsConfigs?.formConfig || window.getConfig()?.formConfig;
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

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
    
        const validationResults = await this.inputsValidation(form);  //await because we can make async check (for example: email verify for send opportunity)

        if (validationResults.every(({ isValid }) => isValid)) {
            this.addLoader();
            try {
                await this.fetchExample();

                this.handleSuccessFormValidation(form);
            } catch (error) {
                console.error(error);
                this.showFail();
            }

            this.removeLoader(form);

        } else {
            //show error on correspond input
            const validationResultsForErrors = validationResults.filter(item => typeof item === 'object')
            validationResultsForErrors.forEach(({ input, isValid }) => this.toggleError(input, isValid));
        }
    }

    handleSuccessFormValidation = (form) => {
        const emailInput = form.querySelector('[name="email"]');
        const phoneInput = form.querySelector('[name="phone"]');

        this.showSuccess({ email: emailInput ? emailInput.value : '', phone: phoneInput ? phoneInput.value : '' });

        const formDataObj = this.createDataObject(form, this.placement)

        window.dispatchEvent(new CustomEvent('submitForm', { detail: { formDataObj } }));

        this.isFormSubmitted = true;
        this.removeLoader();
    };

    inputsValidation = async (form) => {
        const inputs = Array.from(form.querySelectorAll('input'));

        const validationResults = checkInputsValidations(inputs);

        return validationResults;
    }

    fetchExample = () => {
        const isSuccess = true;

        return new Promise((resolve, reject) => {
            const TIMEOUT_DURATION = 2000;

            setTimeout(() => {
                if (isSuccess) {
                    resolve();
                } else {
                    reject();
                }
            }, TIMEOUT_DURATION);
        });
    }
    
    createDataObject(form, placement) {
        const inputs = {};

        for (const [name, value] of (new FormData(form)).entries()) {
            inputs[name] = value;
        }

        const { id, mailConfig } = this.config;

        const formDataObj = {
            inputs,
            mailConfig,
            website: window.location.hostname,
            url: window.location.pathname,
            formId: id,
            formPlacement: placement,
            referrer: localStorage.getItem('referrer'),
        };

        return formDataObj;
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
                    ${input.title ? `<label for="${input.name}">${input.title}</label>` : ''}
                    <${tag} type="text" name=${input.name} ${input.placeholder ? `placeholder="${input.placeholder}"` : ''} ${JSON.parse(input.required) ? 'required' : ''} ${maxLength ? `maxlength=${maxLength}` : ''}></${tag}>
                    ${input.type === 'email' || input.type === 'phone' ? `<span class="${input.type}-error">${input.errorText}</span>` : ''}
                </div>
            `;
        }, '');
    }
}

if (!customElements.get('get-in-touch-form')) {
    customElements.define('get-in-touch-form', GetInTouchForm);
}