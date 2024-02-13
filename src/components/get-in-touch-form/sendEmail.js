export async function sendEmail(form, formConfig, placement) {
    if (validate(form)) {

        const response = await sendRequest(form, formConfig.mailConfig, formConfig.id, placement);
        if (response.status == 'success') {
            return true;
        } else {
            if (response.error) {
                console.error(response.error)
            }
            return false;
        }
    }
}

async function sendRequest(form, mailConfig, formId, placement) {
    const formData = {};
    for (const [name, value] of (new FormData(form)).entries()) {
        formData[name] = value;
    }

    const searchParams = getQueryParams();
    
    const formDataObj = {
        Name: formData.name,
        Phone: formData.phone,
        Email: formData.email,
        Companty: formData.company,
        Message: formData.message,
        Website:  window.location.hostname,
        Url: window.location.pathname,
        FormId: formId,
        FormPlacement: placement,
        SearchParams: {
            ...searchParams
        },
        Referrer: localStorage.getItem('referrer'),
    };
    
    window.dispatchEvent(new CustomEvent('submitForm', {detail: {formDataObj}}));

    const template = {
        ...mailConfig,
        replyTo: formData.email ? formData.email : 'none',
        html: "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            `<title>${mailConfig.subject}</title>` +
            "</head>" +
            "<body>" +
            "<h3>" +
            `${mailConfig.subject}` +
            "</h3>" +
            "<ul>" +
            "<li><strong>" +
            "formId: </strong>" + `${formId}` +
            "</li>" +
            "<li><strong>" +
            "placement: </strong>" + `${placement}` +
            "</li>" +
            `${Object.entries(formData).reduce((acc, [name, value]) => acc + `<li><strong>${name}: </strong>${value}</li>`, '')}` +
            "<li> <strong>" +
            "Url: </strong>" + window.location.pathname +
            "</li>" +
            "</ul>" +
            "</body>" +
            "</html>"
    };

    try {
        const response = await fetch('https://gudhub.com/api/services/prod/send-email', {
            method: 'POST',
            body: JSON.stringify(template),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.status == 200) {
            return {
                status: 'success'
            }
        } else {
            return {
                status: 'error'
            }
        }
    } catch (error) {
        return {
            status: 'error',
            error
        }
    }
}

function getQueryParams() {
    var url = window.location.search.substring(1);
    var queryParamsArray = url.split("&");
    if (queryParamsArray.length === 1 && queryParamsArray[0] === '') {
        return {};
    }
    var queryParams = {};
    for (var i = 0; i < queryParamsArray.length; i++) {
        var param = queryParamsArray[i].split("=");
        queryParams[param[0]] = decodeURIComponent(param[1]);
    }
    return queryParams;
}

function validate(form) {
    const emailInput = form.querySelector('input[name="email"]');
    const email = emailInput.value;
    const phoneInput = form.querySelector('input[name="phone"]');
    let errorEmail = false;
    let errorPhone = false;
    
    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (!email.match(emailRegex)) {
        emailInput.classList.add('error');
        emailInput.parentElement.classList.add('error-input');
        errorEmail = true;
    } else {
        emailInput.classList.remove('error');
        emailInput.parentElement.classList.remove('error-input');
        errorEmail = false;
    }

    if (phoneInput && phoneInput.value) {
        const phone = phoneInput.value;
        let phoneRegex = /^[0-9 ()+-]+$/;
        if (!phone.match(phoneRegex)) {
            phoneInput.classList.add('error');
            phoneInput.parentElement.classList.add('error-input');
            errorPhone = true;
        } else {
            phoneInput.classList.remove('error');
            phoneInput.parentElement.classList.remove('error-input');
            errorPhone = false;
        }
    }
    if (errorPhone || errorEmail) {
        return false;
    } else {
        let errors = document.querySelectorAll('.error-input');
        if (errors.length) {
            for (let error in errors) {
                errors[error].classList.remove('error-input');
            }
        }
    }

    return true;
}