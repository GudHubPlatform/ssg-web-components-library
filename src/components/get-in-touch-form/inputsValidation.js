export const checkInputsValidations = (inputs) => {
    const validationCallbacks = {
        email: emailValidation,
        phone: phoneValidation
    };

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

const isEmptyAndOptional = (input) => {
    const value = input.value.trim();
    return value === '' && !input.hasAttribute('required');
};

const emailValidation = (input) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let isValid = isEmptyAndOptional(input) || regex.test(input.value);

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
    const regex = /^\+?\d+$/;

    let isValid = isEmptyAndOptional(input) || regex.test(input.value);

    if (!isValid) {
        input.classList.add('error');
        input.parentElement.classList.add('error-input');
    } else {
        input.classList.remove('error');
        input.parentElement.classList.remove('error-input');
    }

    return isValid;
};