const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // organization: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: false,
    //     ref: 'Organization'
    // }, 
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('User', userSchema)