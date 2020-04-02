const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
     }  
});

module.exports = UserModel = mongoose.model('users', userSchema);