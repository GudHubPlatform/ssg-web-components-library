const emailValidation = (input) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let isValid = regex.test(input.value);

    if (!isValid) {
        input.classList.add('error');
        input.parentElement.classList.add('error-input');
    } else {
        input.classList.remove('error');
        input.parentElement.classList.remove('error-input');
    }

    return isValid;
};

const phoneValidation = (input) => {
    const regex = /^\d{10}$/;

    let isValid = regex.test(input.value);

    if (!isValid) {
        input.classList.add('error');
        input.parentElement.classList.add('error-input');
    } else {
        input.classList.remove('error');
        input.parentElement.classList.remove('error-input');
    }

    return isValid;
};

export const validationCallbacks = {
    email: emailValidation,
    phone: phoneValidation
};