const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const profileSchema = new Schema({
    user : {        
        type: Schema.Types.ObjectId,
        ref: 'users'
    },   
    website: {
        type: String
    },
    bio : {
        type: String
    },
    location : {
        type: String
    },
    phoneNumber : {
        type: String
    },
    gender : {
        type: String
    }     
}
)

module.exports = ProfileModel = mongoose.model('profile', profileSchema);