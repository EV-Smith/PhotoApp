const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data){

    const errors = {};
    
    //Email validation
    if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid';        
    }  
    if(isEmpty(data.email)){
        errors.email = 'Email field is required';   
    }

    //Full name validation
    if(!validator.isLength(data.fullName, {min:2, max:30})){
        errors.fullName = 'Full name must be between 2 and 30 character';
    }
    if(isEmpty(data.fullName)){
        errors.fullName = 'Full name field is required';
    }

     //Username validation
     if(!validator.isLength(data.userName, {min:2, max:30})){
        errors.userName = 'User name must be between 2 and 30 character';
    }
    if(isEmpty(data.userName)){
        errors.userName = 'User name field is required';
    }

    //Pssword validation
    if(!validator.isLength(data.password, {min:6 , max:30})){
        errors.password = 'Password must be between 6 and 30 character';        
    }  
    if(isEmpty(data.password)){
        errors.password = 'password field is required';   
    }

    //Pssword2 validation    
    if(isEmpty(data.password2)){
        errors.password2 = 'Confirm password field is required';   
    }
    if(!validator.equals(data.password, data.password2)){      
        errors.password2 = 'Passwords must match';            
    } 

    return{
        errors,
        isValid: isEmpty(errors)
    }
}