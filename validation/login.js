const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){

    const errors ={};

    //Email validation 
    if(isEmpty(data.userNameOrEmail)){
        errors.userNameOrEmail = 'Username or email field is required';
    }
  
    //Password validation   
    if(isEmpty(data.password)){
        errors.password ='Password field is required';
    }

    return {
        errors,
        isValid : isEmpty(errors)        
    }

}
