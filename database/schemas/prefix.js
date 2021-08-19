const Mongoose = require('mongoose')

const PrefixSchema = Mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },

    prefix: {
        type: String,
        required: true
    }
})

module.exports = Mongoose.model('prefixes', PrefixSchema)