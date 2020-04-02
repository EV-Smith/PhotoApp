const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 25 })) {
    errors.name = 'Name should be between 2 and 25 characters';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (Validator.isEmpty(data.userName)) {
    errors.userName = 'Username field is required';
  } 
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  //Email validation
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';        
  }  
  if (isEmpty(data.email)) {
    errors.email = 'Email field is required';   
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};