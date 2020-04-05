const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {}; 

  if (Validator.isEmpty(data.postPhoto)) {
    errors.postPhoto = 'Photo is required.';
  }

  if (!Validator.isLength(data.postCaption, { min: 2, max: 300 })) {
    errors.postCaption = 'Caption can only be between 2 and 300 characters in length.';
  }

  if (Validator.isEmpty(data.postCaption)) {
    errors.postCaption = 'Caption is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};