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
    }

    onServerRender() {
        if (this.hasAttribute('data-in-popup')) {
            return;
        }
        
        this.initConfig(window.constants.form_config);
        super.render(html);
    }

    onClientReady() {
        if (!this.hasAttribute('data-in-popup')) {
        this.initConfig(window.website_config.form);
            this.getElementsByTagName('form')[0].addEventListener('submit', (e) => this.handleSubmit(e.target));
        }
    }

    clientRender() {
        this.initConfig(window.website_config.form);
        super.render(html);
        this.getElementsByTagName('form')[0].addEventListener('submit', (e) => this.handleSubmit(e.target));
    }

    onParentPopupClose() {
        if (this.isFormSubmitted) {
            setTimeout(() => this.hideSuccess(), 500);
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

        this.addLoader();
        
        const res = await sendEmail(element, this.config, this.placement);
        this.removeLoader(element);
        let email = this.querySelector('[name="email"]').value;
        let phone = this.querySelector('[name="phone"]').value || '';
        if (res) {
            this.isFormSubmitted = true;
            this.showSuccess({email, phone});
        }
    }
    async addLoader() {
        this.classList.add('loading');
        this.querySelector('button[type="submit"]').disabled = true;
    }
    async removeLoader() {
        this.classList.remove('loading');
        this.querySelector('button[type="submit"]').disabled = false;
    }
    async showSuccess({email, phone}) {
        this.getElementsByClassName('email')[0].innerText = email;
        if (phone) {
            this.querySelector('.check_entity.phone_entity').classList.add('provided');
            this.getElementsByClassName('phone')[0].innerText = phone;
        }
        this.classList.add('success');
    }
    async hideSuccess() {
        this.getElementsByClassName('email')[0].innerText = '';
        this.getElementsByClassName('phone')[0].innerText = '';
        this.querySelector('.check_entity.phone_entity').classList.remove('provided');
        this.classList.remove('success');
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
            return acc + `
                <div class="input-wrap col-${input.width}">
                    <${tag} type="text" name=${input.name} placeholder="${input.placeholder}" ${JSON.parse(input.required) ? 'required' : ''} maxlength=${maxSymbols[input.type]}></${tag}>
                    ${input.type === 'email' || input.type === 'phone' ? `<span class="${input.type}-error">${input.errorText}</span>` : ''}
                </div>
            `}, '');
    }
}

if(!customElements.get('get-in-touch-form')) {
    customElements.define('get-in-touch-form', GetInTouchForm);
}