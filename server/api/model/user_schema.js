const mongoose = require('mongoose')




const userModel = mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },

    userName: {
        type: String,
        require: true,
        unique: true
    },
   
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
   
}, { timestamps: true })
mongoose.model('userModel', userModel);
module.exports = userModel;

