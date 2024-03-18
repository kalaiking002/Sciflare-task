const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    address: {
        type: String,
        required: true
    }, 
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Organization', organizationSchema)