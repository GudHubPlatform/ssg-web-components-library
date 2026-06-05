import html from './liqpay-component.html';
import './liqpay-component.scss';
import jsonTemplate from './liqpay-component.json';

class LiqpayComponent extends window.GHComponent {
    constructor() {
        super();
        super.setDefaultData(jsonTemplate);

        this.isLoading = false;
    }

    async onServerRender() {
        super.render(html);
    }

    onClientRender() {
        this.initComponent();
    }

    initComponent() {
        this.titleElement = this.querySelector('[data-liqpay-title]');
        this.subtitleElement = this.querySelector('[data-liqpay-subtitle]');
        this.amountElement = this.querySelector('[data-liqpay-amount]');
        this.descriptionElement = this.querySelector('[data-liqpay-description]');
        this.textElement = this.querySelector('[data-liqpay-text]');
        this.orderRowElement = this.querySelector('[data-liqpay-order-row]');
        this.orderIdElement = this.querySelector('[data-liqpay-order-id]');
        this.formElement = this.querySelector('[data-liqpay-form]');
        this.dataInput = this.querySelector('[data-liqpay-data]');
        this.signatureInput = this.querySelector('[data-liqpay-signature]');
        this.buttonElement = this.querySelector('[data-liqpay-button]');
        this.buttonTextElement = this.querySelector('[data-liqpay-button-text]');
        this.errorElement = this.querySelector('[data-liqpay-error]');

        this.renderPaymentInfo();
        this.bindEvents();
    }

    getConfig() {
        return {
            ...jsonTemplate,
            ...(this.json || {})
        };
    }

    renderPaymentInfo() {
        const config = this.getConfig();

        console.log("CONFIG:", config);

        const amount = Number(config.amount || 0);
        const currency = config.currency || 'UAH';

        this.titleElement.textContent = config.title || '';
        this.subtitleElement.textContent = config.subtitle || '';
        this.descriptionElement.textContent = config.payment_description || '';
        this.textElement.textContent = config.description || '';
        this.amountElement.textContent = this.formatAmount(amount, currency);
        this.buttonTextElement.textContent = config.button_text || 'Сплатити';

        if (config.order_id) {
            this.orderIdElement.textContent = config.order_id;
            this.orderRowElement.hidden = false;
        } else {
            this.orderIdElement.textContent = '';
            this.orderRowElement.hidden = true;
        }

        this.formElement.action = config.liqpay_checkout_url;
    }

    bindEvents() {
        this.buttonElement.addEventListener('click', () => this.handlePayment());
    }

    async handlePayment() {
        if (this.isLoading) {
            return;
        }

        const config = this.getConfig();

        this.hideError();

        if (!this.validatePaymentConfig(config)) {
            this.showError('Некоректні дані для оплати.');
            return;
        }

        try {
            this.setLoading(true);

            const payment = await this.createPayment(config);

            this.dataInput.value = payment.data;
            this.signatureInput.value = payment.signature;

            this.formElement.submit();
        } catch (error) {
            console.error('Failed to create LiqPay payment:', error);
            this.showError(
                config.error_text || 'Не вдалося підготувати оплату. Спробуйте ще раз.'
            );
        } finally {
            this.setLoading(false);
        }
    }

    async createPayment(config) {
        const response = await fetch(`https://gudhub-nodejs.ngrok.io:443${config.create_payment_url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: config.amount,
                currency: config.currency,
                order_id: config.order_id,
                description: config.payment_description
            })
        });

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(`Payment request failed with status ${response.status}: ${errorText}`);
        }

        const payment = await response.json();

        if (!payment?.data || !payment?.signature) {
            throw new Error('Invalid payment response');
        }

        return payment;
    }

    validatePaymentConfig(config) {
        const amount = Number(config.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return false;
        }

        if (!config.currency) {
            return false;
        }

        if (!config.order_id) {
            return false;
        }

        if (!config.payment_description) {
            return false;
        }

        if (!config.create_payment_url) {
            return false;
        }

        if (!config.liqpay_checkout_url) {
            return false;
        }

        return true;
    }

    setLoading(isLoading) {
        const config = this.getConfig();

        this.isLoading = isLoading;
        this.buttonElement.disabled = isLoading;
        this.buttonTextElement.textContent = isLoading
            ? config.loading_text || 'Підготовка оплати...'
            : config.button_text || 'Сплатити';
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.hidden = false;
    }

    hideError() {
        this.errorElement.textContent = '';
        this.errorElement.hidden = true;
    }

    formatAmount(amount, currency) {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency
        }).format(amount);
    }
}

window.customElements.define('liqpay-component', LiqpayComponent);