const Mongoose = require('mongoose')

const ProfileSchema = Mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    arribas: {
        type: Number,
        required: true,
        default: 1
    },
    muertes: {
        type: Number,
        required: true,
        default: 1
    },
    pontos: {
        type: Number,
        required: true,
        default: 1
    },
    boosts: {
        type: Array,
        required: true,
    }
})

module.exports = Mongoose.model('profiles', ProfileSchema)