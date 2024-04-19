import html from './get-in-touch-form.html';
import './get-in-touch-form.scss';
import { sendEmail } from './sendEmail.js';
import defaultConfigs from './get-in-touch-form-data.json';

class GetInTouchForm extends GHComponent {
    
    constructor() {
        super();
        this.formId = this.getAttribute("data-form-id");
        this.defaultConfigs = defaultConfigs;

        this.generateInput = this.generateInput;
        this.isFormSubmitted = false;
        this.placement = 'main';

        this.config = window.getConfig().formConfig;
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
        this.getElementsByTagName('form')[0].addEventListener('submit', (e) => this.handleSubmit(e.target));
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
            this.config = formConfigs.find(({id}) => id === this.formId);
            if (!this.config) {
                throw e;
            }
        } catch (error) {
            const defaultId = this.isInPopup ? 'default popup' : 'default';
            this.config = defaultConfigs.find(({id}) => id === defaultId);
        }
    }

    async handleSubmit(element) {
        event.preventDefault();

        const emailInput = this.querySelector('[name="email"]');
        let email = emailInput ? emailInput.value : '';
        
        const phoneInput = this.querySelector('[name="phone"]');
        let phone = phoneInput ? phoneInput.value || '' : '';
        
        const isValidFields = this.validation(email, phone);

        if (isValidFields.phoneValid && isValidFields.emailValid) {
            this.addLoader();

            const res = await sendEmail(element, this.config, this.placement);
            
            this.removeLoader(element);
            this.isFormSubmitted = true;
            if (res) {
                this.showSuccess({email, phone});
            } else {
                this.showFail();
            }
        } else {
            isValidFields.emailValid ? emailInput.classList.remove('error') : emailInput.classList.add('error');

            isValidFields.phoneValid ? phoneInput.classList.remove('error') : phoneInput.classList.add('error');
        }
    }

    validation (email = '', phone = '') {
        const isPhoneRequired = this.config.inputs.find(input => input.name === "phone").required;
        const isEmailRequired = this.config.inputs.find(input => input.name === "email").required;
        
        let emailValid;
        if (email.length === 0 && isEmailRequired == 'false') {
            emailValid = true;
        } else {
            emailValid = /\S+@\S+\.\S+/.test(email);
        }
        
        let phoneValid;
        if (phone.length === 0 && isPhoneRequired == 'false') {
            phoneValid = true;
        } else {
            phoneValid = /^\+?[\d()-\s]+$/.test(phone);
        }

        return { phoneValid, emailValid };
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
        this.getElementsByClassName('email')[0].innerText = email;
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
                    <${tag} type="text" name=${input.name} placeholder="${input.placeholder}" ${JSON.parse(input.required) ? 'required' : ''} ${ maxLength ? `maxlength=${maxLength}` : ''}></${tag}>
                    ${input.type === 'email' || input.type === 'phone' ? `<span class="${input.type}-error">${input.errorText}</span>` : ''}
                </div>
            `}, '');
    }
}

if(!customElements.get('get-in-touch-form')) {
    customElements.define('get-in-touch-form', GetInTouchForm);
}