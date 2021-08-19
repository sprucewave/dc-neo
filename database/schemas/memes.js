const Mongoose = require('mongoose')

const MemeSchema = Mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    reactions: {
        type: Number,
        required: true,
        default: 10
    },
    mainchannel: {
        type: String,
        required: true
    },
    firstchannel: {
        type: String,
        required: true
    },
    secondchannel: {
        type: String,
        required: true
    }
})

module.exports = Mongoose.model('memes', MemeSchema)