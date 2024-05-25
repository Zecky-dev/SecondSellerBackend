const validateEmail = function(email) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

const validatePhoneNumber = function(phoneNumber) {
    return /(^[0\s]?[\s]?)([(]?)([5])([0-9]{2})([)]?)([\s]?)([0-9]{3})([\s]?)([0-9]{2})([\s]?)([0-9]{2})$/.test(phoneNumber);
}

const emailValidator = [validateEmail, 'Invalid e-mail adddress!'];
const phoneNumberValidator = [validatePhoneNumber, 'Invalid phone number!']

module.exports =  {
    emailValidator,
    phoneNumberValidator
}
