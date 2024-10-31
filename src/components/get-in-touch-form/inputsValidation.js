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
    // const regex = /^\d{10}$/; // Default strict regex for checking phone number

    const regex = /^\+?\d+$/; // We can write only numbers without special symbols besides "+" sign

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